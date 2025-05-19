import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/payload.dto';
import { PermissionDetailDto, PermissionDto } from './dto/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppPermission } from 'src/shared/enums';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { PermissionGuard } from '../auth/guards';

@UseGuards(JwtAuthGuard)
@Permissions(AppPermission.PermissionDefault)
@UseGuards(PermissionGuard)
@ApiTags('permissions')
@Controller('permissions')
@ApiBearerAuth()
export class PermissionsController {
    constructor(private permissionService: PermissionsService) { }
    @Permissions(AppPermission.PermissionRead)
    @UseGuards(PermissionGuard)
    @Get()
    @ApiOperation({ summary: 'Get All Root Permissions' })
    @ApiResponse({ status: HttpStatus.OK })
    async getAll( /*@GetUser() user */): Promise<[PermissionDto[], number]> {
        return await this.permissionService.getAllParentPermissions(/*,user */)
    }

    @Permissions(AppPermission.PermissionRead)
    @UseGuards(PermissionGuard)
    @Get('/:id')
    @ApiOperation({ summary: 'Get Permission by Id' })
    @ApiResponse({ status: HttpStatus.OK })
    async get(@Param('id') id: string): Promise<PermissionDetailDto> {
        return await this.permissionService.get(id)
    }

    @Permissions(AppPermission.PermissionWrite)
    @UseGuards(PermissionGuard)
    @Post()
    @ApiOperation({ summary: 'Create a Permission' })
    @ApiResponse({ status: HttpStatus.CREATED })
    async create(@Body() createPermissionDto: CreatePermissionDto): Promise<PermissionDetailDto> {
        return await this.permissionService.create(createPermissionDto)
    }

    @Permissions(AppPermission.PermissionWrite)
    @UseGuards(PermissionGuard)
    @Put('/:id')
    @ApiOperation({ summary: 'Update a Permission' })
    @ApiResponse({ status: HttpStatus.OK })
    async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto): Promise<PermissionDetailDto> {
        return await this.permissionService.update(id, updatePermissionDto)
    }

    @Permissions(AppPermission.PermissionWrite)
    @UseGuards(PermissionGuard)
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a Role' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async delete(@Param('id') id: string): Promise<void> {
        return await this.permissionService.delete(id)
    }
}
