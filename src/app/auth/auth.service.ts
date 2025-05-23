import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Response } from "express";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import { Role, Usership } from "src/database/entities";
import { LoginResponseDto, JwtPayload, RegisterCredentialsDto, RefreshTokenResponseDto, ReqUser } from "./dto";
import { compareKey, customizeException, hashAKey } from "src/shared/utils/handlers";
import { RoleGroup } from "src/shared/enums";
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
            createdUser.usership = usership;
            this.userRepository.save(createdUser)
            return plainToInstance(UserDetailDto, createdUser, { excludeExtraneousValues: true });
        } catch (err) {
            return customizeException(err, { entity: "User" })
        }
    }
    async login(user: ReqUser, res: Response): Promise<LoginResponseDto> {
        const jwtPaylod: JwtPayload = { id: user.id, username: user.username }
        const accessToken = await this.generateAccessToken(jwtPaylod)
        const refreshToken = await this.generateRefreshToken(jwtPaylod)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // #TODO: change to true in production
            maxAge: config.jwt.JWT_REFRESH_TOKEN_EXPIRED_IN_HOURS * 60 * 60 * 1000
        })
        const hashedRefreshToken = await hashAKey(refreshToken)
        await this.userRepository.update(user.id, { usership: { lastLoginDate: new Date(), hashedRefreshToken } })
        return { accessToken, expireInHours: config.jwt.JWT_EXPIRED_IN_HOURS, userId: user.id }
    }

    async validateUser(usernameOrEmailAddress: string, password: string): Promise<ReqUser> {
        const user = await this.userRepository.findOne({
            where: [
                { username: usernameOrEmailAddress },
                { emailAddress: usernameOrEmailAddress }
            ],
            relations: {
                tenant: true,  // Load tenant relation
                role: {
                    rolePermissions: {
                        permission: {
                            parent: true  // Load nested relations for permissions
                        }
                    }
                }
            },
            select: {
                tenant: { id: true },
                role: {
                    group: true,
                    rolePermissions: {
                        isActive: true,
                        permission: {
                            name: true,
                            parent: { name: true }
                        }
                    }
                }
            }
        });

        if (user && await compareKey(user.password, password)) {
            const permissions = user.role.rolePermissions
                .filter(rolePermission => rolePermission.isActive)
                .map(rolePermission => rolePermission.permission.getAppPermission())

            return { id: user.id, username: user.username, isActive: user.isActive, tenantId: user.tenant?.id, roleGroup: user.role.group, permissions };
        }

        throw new HttpException('Please check your login credentials', HttpStatus.UNAUTHORIZED);
    }

    async validateJwtUser(userId: string): Promise<ReqUser> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: { // this is used for nested relations instead of array ['tenant', 'role'] -- you can't select role.rolePermissions in array expression
                tenant: true,
                role: {
                    rolePermissions: {
                        permission: {
                            parent: true
                        }
                    }
                },
                usership: true
            },
            select: {
                tenant: { id: true },
                role: { group: true, rolePermissions: { permission: { name: true }, isActive: true } },
                usership: { hashedRefreshToken: true }
            }
        });
        if (!user) throw new UnauthorizedException('User not found!');
        if (!user.usership.hashedRefreshToken) throw new UnauthorizedException('Please login!');
        const permissions = user.role.rolePermissions
            .filter(rolePermission => rolePermission.isActive)
            .map(rolePermission => rolePermission.permission.getAppPermission())
        return { id: user.id, username: user.username, isActive: user.isActive, tenantId: user.tenant?.id, roleGroup: user.role.group, permissions };
    }

    async validateRefreshToken(userId: string, refreshToken: string): Promise<ReqUser> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                usership: true,
                tenant: true,
                role: {
                    rolePermissions: {
                        permission: {
                            parent: true
                        }
                    }
                }
            },
            select: { tenant: { id: true }, role: { group: true, rolePermissions: { permission: { name: true, parent: { name: true } }, isActive: true } } }
        });
        if (user && await compareKey(user.usership.hashedRefreshToken, refreshToken)) {
            const permissions = user.role.rolePermissions
                .filter(rolePermission => rolePermission.isActive)
                .map(rolePermission => rolePermission.permission.getAppPermission())
            return { id: user.id, username: user.username, isActive: user.isActive, tenantId: user.tenant?.id, roleGroup: user.role.group, permissions };
        }
        throw new UnauthorizedException('User not found or Credentials are invalid!');
    }

    async refreshToken(user: ReqUser, res: Response): Promise<RefreshTokenResponseDto> {
        const refreshPayload: JwtPayload = { id: user.id, username: user.username }
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