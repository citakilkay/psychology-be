import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from './dto/payload.dto';
import { RoleDetailDto, RoleDto } from './dto/response.dto';
import { AppPermission } from 'src/shared/enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards';
import { RequirePermissions } from 'src/shared/decorators';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions(AppPermission.RoleDefault)
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @RequirePermissions(AppPermission.RoleRead)
  @Get()
  @ApiOperation({ summary: 'Get All Roles' })
  @ApiResponse({ status: HttpStatus.PARTIAL_CONTENT })
  @HttpCode(HttpStatus.PARTIAL_CONTENT) // #TEST -if it is not neccesssary remove it.
  async getAll(
    @Query() filterRoleDto: FilterRoleDto /*@GetUser() user */,
  ): Promise<[RoleDto[], number]> {
    return await this.roleService.getAll(filterRoleDto /*,user */);
  }

  @RequirePermissions(AppPermission.RoleRead)
  @Get('/:id')
  @ApiOperation({ summary: 'Get Role by Id' })
  @ApiResponse({ status: HttpStatus.OK })
  async get(@Param('id') id: string): Promise<RoleDetailDto> {
    return await this.roleService.get(id);
  }

  @RequirePermissions(AppPermission.RoleWrite)
  @Post()
  @ApiOperation({ summary: 'Create a Role' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleDetailDto> {
    return await this.roleService.create(createRoleDto);
  }

  @RequirePermissions(AppPermission.RoleWrite)
  @Put('/:id')
  @ApiOperation({ summary: 'Update a Role' })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDetailDto> {
    return await this.roleService.update(id, updateRoleDto);
  }

  @RequirePermissions(AppPermission.RoleWrite)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a Role' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async delete(@Param('id') id: string): Promise<void> {
    return await this.roleService.delete(id);
  }
}
