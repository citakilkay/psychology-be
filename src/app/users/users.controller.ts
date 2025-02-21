import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from './dto/payload.dto';
import { UserDetailDto, UserDto } from './dto/response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @HttpCode(HttpStatus.PARTIAL_CONTENT)
    @Get()
    @ApiOperation({ summary: 'Get All User' })
    @ApiResponse({ status: HttpStatus.PARTIAL_CONTENT })
    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.SuperAdmin)
    async getAll(@Query() filterUserDto: FilterUserDto, /*@GetUser() user */): Promise<[UserDto[], number]> {
        return await this.userService.getAll(filterUserDto /*,user */)
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get User by Id' })
    @ApiResponse({ status: HttpStatus.OK })
    async get(@Param('id') id: string): Promise<UserDetailDto> {
        return await this.userService.get(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create a User' })
    @ApiResponse({ status: HttpStatus.CREATED })
    async create(@Body() createUserDto: CreateUserDto): Promise<UserDetailDto> {
        return await this.userService.create(createUserDto)
    }

    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    @ApiOperation({ summary: 'Update a User' })
    @ApiResponse({ status: HttpStatus.OK })
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDetailDto> {
        return await this.userService.update(id, updateUserDto)
    }
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a User' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async delete(@Param('id') id: string): Promise<void> {
        return await this.userService.delete(id)
    }

    // #TODO -- changePassword endpoint after auth 
}
