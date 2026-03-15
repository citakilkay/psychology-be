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
import { TenantsService } from './tenants.service';
import {
  CreateTenantDto,
  FilterTenantDto,
  UpdateTenantDto,
} from './dto/payload.dto';
import { TenantDetailDto, TenantDto } from './dto/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards';
import { AppPermission } from 'src/shared/enums';
import { RequirePermissions } from 'src/shared/decorators';

@ApiTags('tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions(AppPermission.TenantDefault)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @RequirePermissions(AppPermission.TenantRead)
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Get()
  @ApiOperation({ summary: 'Get All Tenant' })
  @ApiResponse({ status: HttpStatus.PARTIAL_CONTENT })
  async getAll(
    @Query() filterTenantDto: FilterTenantDto /*@GetUser() user */,
  ): Promise<[TenantDto[], number]> {
    return await this.tenantsService.getAll(filterTenantDto /*,user */);
  }

  @RequirePermissions(AppPermission.TenantRead)
  @Get('/:id')
  @ApiOperation({ summary: 'Get Tenant by Id' })
  @ApiResponse({ status: HttpStatus.OK })
  async get(@Param('id') id: string): Promise<TenantDetailDto> {
    return await this.tenantsService.get(id);
  }

  @RequirePermissions(AppPermission.TenantWrite)
  @Post()
  @ApiOperation({ summary: 'Create a Tenant' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(
    @Body() createTenantDto: CreateTenantDto,
  ): Promise<TenantDetailDto> {
    return await this.tenantsService.create(createTenantDto);
  }

  @RequirePermissions(AppPermission.TenantWrite)
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  @ApiOperation({ summary: 'Update a Tenant' })
  @ApiResponse({ status: HttpStatus.OK })
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<TenantDetailDto> {
    return await this.tenantsService.update(id, updateTenantDto);
  }

  @RequirePermissions(AppPermission.TenantWrite)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a Tenant' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async delete(@Param('id') id: string): Promise<void> {
    return await this.tenantsService.delete(id);
  }
}
