import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from './dto/payload.dto';
import { RoleDetailDto, RoleDto } from './dto/response.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) { }
    @HttpCode(HttpStatus.PARTIAL_CONTENT)
    @Get()
    @ApiOperation({ summary: 'Get All Roles' })
    @ApiResponse({ status: HttpStatus.PARTIAL_CONTENT })
    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.SuperAdmin)
    async getAll(@Query() filterRoleDto: FilterRoleDto, /*@GetUser() user */): Promise<[RoleDto[], number]> {
        return await this.roleService.getAll(filterRoleDto /*,user */)
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get Role by Id' })
    @ApiResponse({ status: HttpStatus.OK })
    async get(@Param('id') id: string): Promise<RoleDetailDto> {
        return await this.roleService.get(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create a Role' })
    @ApiResponse({ status: HttpStatus.CREATED })
    async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleDetailDto> {
        return await this.roleService.create(createRoleDto)
    }
    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    @ApiOperation({ summary: 'Update a Role' })
    @ApiResponse({ status: HttpStatus.OK })
    async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleDetailDto> {
        return await this.roleService.update(id, updateRoleDto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a Role' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async delete(@Param('id') id: string): Promise<void> {
        return await this.roleService.delete(id)
    }
}
