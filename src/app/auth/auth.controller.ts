import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CustomRequest, LoginCredentialsDto, LoginResponseDto, RegisterCredentialsDto } from "./dto";
import { LocalAuthGuard } from "./guards";
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

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Login with Local Authenticate' })
    @ApiResponse({ status: HttpStatus.OK })
    async login(@Body() loginCredentials: LoginCredentialsDto, @Req() req: CustomRequest): Promise<LoginResponseDto> {
        const user = req.user;
        console.log(loginCredentials)
        return await this.authService.login(user)
    }
}