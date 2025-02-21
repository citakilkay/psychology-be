import { Body, Controller, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginCredentialsDto, RegisterCredentialsDto } from "./dto";
import { LocalAuthGuard } from "./guards";
import { Request } from 'express';
import { UserDetailDto } from "../users/dto/response.dto";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: HttpStatus.CREATED })
    async register(@Body() registerCredentials: RegisterCredentialsDto): Promise<UserDetailDto> {
        return await this.authService.register(registerCredentials)
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Login with Local Authenticate' })
    @ApiResponse({ status: HttpStatus.OK })
    async login(@Body() loginCredentials: LoginCredentialsDto, @Req() req: Request): Promise<{ accessToken: string }> {
        const user = req.user;
        return await this.authService.login(loginCredentials)
    }
}