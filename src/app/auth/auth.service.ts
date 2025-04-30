import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Response } from "express";
import { User } from "src/database/entities/user.entity";
import { QueryFailedError, Repository } from "typeorm";
import { Role, Usership } from "src/database/entities";
import { LoginResponseDto, JwtPayload, RegisterCredentialsDto, RefreshTokenResponseDto } from "./dto";
import { compareKey, customizeException, hashAKey } from "src/shared/utils/handlers";
import { RoleGroup } from "src/shared/enums/role-group.enum";
import { UserDetailDto } from "../users/dto/response.dto";
import { plainToInstance } from "class-transformer";
import { JwtService } from "@nestjs/jwt";
import { getConfig } from "src/shared/config";

const config = getConfig();
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        private jwtService: JwtService
    ) { }

    async register(registerCredentials: RegisterCredentialsDto): Promise<UserDetailDto> {
        const { password, roleId, ...userData } = registerCredentials;
        const hashedPassword = await hashAKey(password)
        const role = await this.roleRepository.findOne({ where: { id: roleId, group: RoleGroup.Client } })
        if (!role) {
            throw new HttpException(`Role with id ${roleId} not found`, HttpStatus.NOT_FOUND);
        }
        try {
            const createdUser = await this.userRepository.create({ ...userData, role, password: hashedPassword })
            const usership = new Usership();
            usership.user = createdUser;
            this.userRepository.save(createdUser)
            return plainToInstance(UserDetailDto, createdUser, { excludeExtraneousValues: true });
        } catch (err) {
            return customizeException(err, { entity: "User" })
        }
    }
    async login(loginPayload: JwtPayload, res: Response): Promise<LoginResponseDto> {
        const accessToken = await this.generateAccessToken(loginPayload)
        const refreshToken = await this.generateRefreshToken(loginPayload)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // #TODO: change to true in production
            maxAge: config.jwt.JWT_REFRESH_TOKEN_EXPIRED_IN_HOURS * 60 * 60 * 1000
        })
        const hashedRefreshToken = await hashAKey(refreshToken)
        await this.userRepository.update(loginPayload.id, { usership: { lastLoginDate: new Date(), hashedRefreshToken } })
        return { accessToken, expireInHours: config.jwt.JWT_EXPIRED_IN_HOURS, userId: loginPayload.id }
    }

    async validateUser(usernameOrEmailAddress: string, password: string): Promise<JwtPayload> {
        const user = await this.userRepository.findOne({ where: [{ username: usernameOrEmailAddress }, { emailAddress: usernameOrEmailAddress }] });
        if (user && await compareKey(user.password, password)) {
            if (!user.isActive) { // #TODO: isActive ise kismi erisebilir
                throw new UnauthorizedException('User is not active');
            }
            return { id: user.id, username: user.username };
        }
        throw new HttpException('Please check your login credentials', HttpStatus.UNAUTHORIZED);
    }

    async validateJwtUser(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
        if (!user) throw new UnauthorizedException('User not found!');
        return user; // #TODO return something else (something contains role)
    }

    async validateRefreshToken(userId: string, refreshToken: string): Promise<JwtPayload> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['usership'], select: { usership: { hashedRefreshToken: true } } });
        if (user && await compareKey(user.usership.hashedRefreshToken, refreshToken))
            return { id: user.id, username: user.username }; // #TODO: not return user 
        throw new UnauthorizedException('User not found or Credentials are invalid!');
    }

    async refreshToken(refreshPayload: JwtPayload, res: Response): Promise<RefreshTokenResponseDto> {
        const accessToken = await this.generateAccessToken(refreshPayload);
        const refreshToken = await this.generateRefreshToken(refreshPayload);
        const hashedRefreshToken = await hashAKey(refreshToken)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // #TODO: change to true in production
            maxAge: config.jwt.JWT_REFRESH_TOKEN_EXPIRED_IN_HOURS * 60 * 60 * 1000
        })
        await this.userRepository.update(refreshPayload.id, { usership: { hashedRefreshToken } })
        return { accessToken, expireInHours: config.jwt.JWT_EXPIRED_IN_HOURS, userId: refreshPayload.id };
    }

    private async generateAccessToken(payload: JwtPayload): Promise<string> {
        const accessToken = this.jwtService.sign(payload)
        return accessToken;
    }
    private async generateRefreshToken(payload: JwtPayload): Promise<string> {
        const refreshToken = this.jwtService.sign(payload, { secret: config.jwt.JWT_REFRESH_TOKEN_SECRET, expiresIn: config.jwt.JWT_REFRESH_TOKEN_EXPIRED_IN_HOURS + 'h' })
        return refreshToken;
    }

    async logout(userId: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        if (!user) throw new UnauthorizedException('User not found!');
        await this.userRepository.update(userId, { usership: { hashedRefreshToken: null } }) // #TEST -- repository.update updatedAt'i guncelliyor mu?
        return;
    }
}