import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto, PermissionDetailDto, PermissionDto } from './dto';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
    constructor(private permissionService: PermissionsService) { }
    @Get()
    @ApiOperation({ summary: 'Get All Root Permissions' })
    @ApiResponse({ status: HttpStatus.OK })
    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.SuperAdmin)
    async getAll( /*@GetUser() user */): Promise<[PermissionDto[], number]> {
        return await this.permissionService.getAllParentPermissions(/*,user */)
    }
    @Get('/:id')
    @ApiOperation({ summary: 'Get Permission by Id' })
    @ApiResponse({ status: HttpStatus.OK })
    async get(@Param('id') id: string): Promise<PermissionDetailDto> {
        return await this.permissionService.get(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create a Permission' })
    @ApiResponse({ status: HttpStatus.CREATED })
    async create(@Body() createPermissionDto: CreatePermissionDto): Promise<PermissionDetailDto> {
        return await this.permissionService.create(createPermissionDto)
    }

    @Put('/:id')
    @ApiOperation({ summary: 'Update a Permission' })
    @ApiResponse({ status: HttpStatus.OK })
    async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleDetailDto> {
        return await this.permissionService.update(id, updateRoleDto)
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a Role' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async delete(@Param('id') id: string): Promise<void> {
        return await this.permissionService.delete(id)
    }
}
