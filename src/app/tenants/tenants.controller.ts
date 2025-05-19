import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TenantsService } from "./tenants.service";
import { CreateTenantDto, FilterTenantDto, UpdateTenantDto } from "./dto/payload.dto";
import { TenantDetailDto, TenantDto } from "./dto/response.dto";

@ApiTags('tenants')
@Controller('tenants')
@ApiBearerAuth()
export class TenantsController {
    constructor(private tenantsService: TenantsService) { }

    @HttpCode(HttpStatus.PARTIAL_CONTENT)
    @Get()
    @ApiOperation({ summary: 'Get All Tenant' })
    @ApiResponse({ status: HttpStatus.PARTIAL_CONTENT })
    // @UseGuards(RolesGuard)
    // @Roles(Role.Admin, Role.SuperAdmin)
    async getAll(@Query() filterTenantDto: FilterTenantDto, /*@GetUser() user */): Promise<[TenantDto[], number]> {
        return await this.tenantsService.getAll(filterTenantDto /*,user */)
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get Tenant by Id' })
    @ApiResponse({ status: HttpStatus.OK })
    async get(@Param('id') id: string): Promise<TenantDetailDto> {
        return await this.tenantsService.get(id)
    }

    @Post()
    @ApiOperation({ summary: 'Create a Tenant' })
    @ApiResponse({ status: HttpStatus.CREATED })
    async create(@Body() createTenantDto: CreateTenantDto): Promise<TenantDetailDto> {
        return await this.tenantsService.create(createTenantDto)
    }

    @HttpCode(HttpStatus.OK)
    @Put('/:id')
    @ApiOperation({ summary: 'Update a Tenant' })
    @ApiResponse({ status: HttpStatus.OK })
    async update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto): Promise<TenantDetailDto> {
        return await this.tenantsService.update(id, updateTenantDto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a Tenant' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT })
    async delete(@Param('id') id: string): Promise<void> {
        return await this.tenantsService.delete(id)
    }
}