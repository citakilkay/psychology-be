import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { FilterUserDto } from './dto/payload/filter-user.dto';
import { User } from 'src/database/entities/user.entity';
import { CreateUserDto } from './dto/payload/create-user.dto';
import { UpdateUserDto } from './dto/payload/update-user.dto';
import e from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }
    @Get()
    @ApiOperation({ summary: 'Get All User' })
    @ApiResponse({ status: HttpStatus.PARTIAL_CONTENT })
    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.SuperAdmin)
    async getAll(@Query() filterUserDto: FilterUserDto, /*@GetUser() user */): Promise<[User[], number]> {
        return await this.userService.getAll(filterUserDto /*,user */)
    }
    @Get('/:id')
    @ApiOperation({ summary: 'Get User by Id' })
    @ApiResponse({ status: HttpStatus.OK })
    async get(@Param('id') id: string) {
        return await this.userService.get(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create a User' })
    @ApiResponse({ status: HttpStatus.CREATED })
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto)
    }

    @Put('/:id')
    @ApiOperation({ summary: 'Update a User' })
    @ApiResponse({ status: HttpStatus.OK })
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(id, updateUserDto)
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a User' })
    @ApiResponse({ status: HttpStatus.OK })
    async delete(@Param('id') id: string): Promise<User> {
        return await this.userService.delete(id)
    }
}
