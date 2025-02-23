import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Response } from "express";
import { User } from "src/database/entities/user.entity";
import { QueryFailedError, Repository } from "typeorm";
import { Role } from "src/database/entities";
import { LoginResponseDto, JwtPayload, RegisterCredentialsDto } from "./dto";
import { comparePassword, extractConflictColumn, hashPassword } from "src/shared/utils/handlers";
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
        const hashedPassword = await hashPassword(password)
        const role = await this.roleRepository.findOne({ where: { id: roleId, group: RoleGroup.Client } })
        if (!role) {
            throw new HttpException(`Role with id ${roleId} not found`, HttpStatus.NOT_FOUND);
        }
        try {
            const createdUser = await this.userRepository.save({ ...userData, role, password: hashedPassword })
            return plainToInstance(UserDetailDto, createdUser, { excludeExtraneousValues: true });
        } catch (err) {
            if (err.code === '23505' && err instanceof QueryFailedError) {
                const conflictColumn = extractConflictColumn(err.driverError.detail)
                throw new HttpException(`A user with the given value ${conflictColumn} already exists`, HttpStatus.CONFLICT);
            }
            if (err.status) {
                throw new HttpException(err.message, err.status);
            }
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async login(loginPayload: JwtPayload, res: Response): Promise<LoginResponseDto> {
        const accessToken = await this.generateAccessToken(loginPayload)
        const refreshToken = await this.generateRefreshToken(loginPayload)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: config.jwt.JWT_REFRESH_TOKEN_EXPIRED_IN_HOURS * 60 * 60 * 1000
        })
        return { accessToken, expireInHours: config.jwt.JWT_EXPIRED_IN_HOURS, userId: loginPayload.id }
    }

    async validateUser(usernameOrEmailAddress: string, password: string): Promise<JwtPayload> {
        const user = await this.userRepository.findOne({ where: [{ username: usernameOrEmailAddress }, { emailAddress: usernameOrEmailAddress }] });
        if (user && await comparePassword(password, user.password)) {
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

    async validateRefreshToken(userId: string, refreshToken: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new UnauthorizedException('User not found!');
        return user; // #TODO: not return user 
    }

    async refreshToken(refreshPayload: JwtPayload): Promise<LoginResponseDto> {
        const accessToken = await this.generateAccessToken(refreshPayload);
        return { accessToken, expireInHours: config.jwt.JWT_EXPIRED_IN_HOURS, userId: refreshPayload.id };
    }

    private async generateAccessToken(payload: JwtPayload): Promise<string> {
        const accessToken = this.jwtService.sign(payload)
        return accessToken;
    }
    private async generateRefreshToken(payload: JwtPayload): Promise<string> {
        const refreshToken = this.jwtService.sign(payload, { secret: config.jwt.JWT_REFRESH_TOKEN_SECRET, expiresIn: config.jwt.JWT_REFRESH_TOKEN_EXPIRED_IN_HOURS })
        return refreshToken;
    }

    async logout(user: User): Promise<void> {
        //#TODO: Implement last login date
        // await this.userRepository.save(user)
    }
}