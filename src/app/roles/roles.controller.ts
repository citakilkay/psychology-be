import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from 'src/database/entities/role.entity';
import { FilterRoleDto } from './dto/payload/filter-role.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) { }
    @Get()
    @ApiOperation({ summary: 'Get All Roles' })
    @ApiResponse({ status: HttpStatus.PARTIAL_CONTENT })
    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.SuperAdmin)
    async getAll(@Query() filterRoleDto: FilterRoleDto, /*@GetUser() user */): Promise<[Role[], number]> {
        return await this.roleService.getAll(filterRoleDto /*,user */)
    }
    @Get('/:id')
    @ApiOperation({ summary: 'Get Role by Id' })
    @ApiResponse({ status: HttpStatus.OK })
    async get(@Param('id') id: string) {
        return await this.roleService.get(id)
    }

    
}
