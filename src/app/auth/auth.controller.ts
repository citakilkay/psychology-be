import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RequestWithUser, LoginCredentialsDto, LoginResponseDto, RegisterCredentialsDto } from "./dto";
import { LocalAuthGuard } from "./guards";
import { UserDetailDto } from "../users/dto/response.dto";
import { RefreshAuthGuard } from "./guards/refresh-auth.guard";
import { Response } from "express";

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

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Login with Local Authenticate' })
    @ApiResponse({ status: HttpStatus.OK })
    async login(@Body() loginCredentials: LoginCredentialsDto, @Req() req: RequestWithUser, @Res() res: Response): Promise<LoginResponseDto> {
        const user = req.user;
        const loginResponse = await this.authService.login(user, res);
        res.status(HttpStatus.OK).json(loginResponse);
        return loginResponse;
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshAuthGuard)
    @Post('refresh-token')
    @ApiOperation({ summary: 'Refresh Token' })
    @ApiResponse({ status: HttpStatus.OK })
    async refreshToken(@Req() req: RequestWithUser) {
        const user = req.user;
        const response = await this.authService.refreshToken(user)
    }
}