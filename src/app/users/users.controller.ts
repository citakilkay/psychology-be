import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from './dto/payload.dto';
import { UserDetailDto, UserDto } from './dto/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser, RequirePermissions } from 'src/shared/decorators';
import { AppPermission } from 'src/shared/enums';
import { PermissionGuard } from '../auth/guards';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions(AppPermission.UserDefault)
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @RequirePermissions(AppPermission.UserRead)
    @HttpCode(HttpStatus.PARTIAL_CONTENT)
    @Get()
    @ApiOperation({ summary: 'Get All User' })
    @ApiResponse({ status: HttpStatus.PARTIAL_CONTENT })
    async getAll(@Query() filterUserDto: FilterUserDto, @GetUser('tenantId') tenantId?: string): Promise<[UserDto[], number]> {
        return await this.userService.getAll(filterUserDto, tenantId)
    }

    @RequirePermissions(AppPermission.UserRead)
    @Get('/:id')
    @ApiOperation({ summary: 'Get User by Id' })
    @ApiResponse({ status: HttpStatus.OK })
    async get(@Param('id') id: string, @GetUser('tenantId') tenantId?: string): Promise<UserDetailDto> {
        return await this.userService.get(id, tenantId)
    }

    @RequirePermissions(AppPermission.UserWrite)
    @Post()
    @ApiOperation({ summary: 'Create a User' })
    @ApiResponse({ status: HttpStatus.CREATED })
    async create(@Body() createUserDto: CreateUserDto, @GetUser('tenantId') tenantId?: string): Promise<UserDetailDto> {
        return await this.userService.create(createUserDto, tenantId)
    }

    @RequirePermissions(AppPermission.UserWrite)
    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    @ApiOperation({ summary: 'Update a User' })
    @ApiResponse({ status: HttpStatus.OK })
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser('tenantId') tenantId?: string): Promise<UserDetailDto> {
        return await this.userService.update(id, updateUserDto)
    }

    @RequirePermissions(AppPermission.UserWrite)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a User' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async delete(@Param('id') id: string, @GetUser('tenantId') tenantId?: string): Promise<void> {
        return await this.userService.delete(id, tenantId)
    }

    // #TODO -- changePassword endpoint after auth 
}
