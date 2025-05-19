import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/payload.dto';
import { PermissionDetailDto, PermissionDto } from './dto/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppPermission } from 'src/shared/enums';
import { RequirePermissions } from 'src/shared/decorators';
import { PermissionGuard } from '../auth/guards';

@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions(AppPermission.PermissionDefault)
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionService: PermissionsService) { }
    @RequirePermissions(AppPermission.PermissionRead)
    @Get()
    @ApiOperation({ summary: 'Get All Root Permissions' })
    @ApiResponse({ status: HttpStatus.PARTIAL_CONTENT })
    async getAll( /*@GetUser() user */): Promise<[PermissionDto[], number]> {
        return this.permissionService.getAllParentPermissions(/*,user */)
    }

    @RequirePermissions(AppPermission.PermissionRead)
    @Get('/:id')
    @ApiOperation({ summary: 'Get Permission by Id' })
    @ApiResponse({ status: HttpStatus.OK })

    async get(@Param('id') id: string): Promise<PermissionDetailDto> {
        return this.permissionService.get(id)
    }

    @RequirePermissions(AppPermission.PermissionWrite)
    @Post()
    @ApiOperation({ summary: 'Create a Permission' })
    @ApiResponse({ status: HttpStatus.CREATED })
    async create(@Body() createPermissionDto: CreatePermissionDto): Promise<PermissionDetailDto> {
        return this.permissionService.create(createPermissionDto)
    }

    @RequirePermissions(AppPermission.PermissionWrite)
    @Put('/:id')
    @ApiOperation({ summary: 'Update a Permission' })
    @ApiResponse({ status: HttpStatus.OK })
    async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto): Promise<PermissionDetailDto> {
        return this.permissionService.update(id, updatePermissionDto)
    }

    @RequirePermissions(AppPermission.PermissionWrite)
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a Permission' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async delete(@Param('id') id: string): Promise<void> {
        return this.permissionService.delete(id)
    }
}
