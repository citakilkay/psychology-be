import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tenant, User } from "src/database/entities";
import { FindOptionsWhere, QueryFailedError, Repository } from "typeorm";
import { CreateTenantDto, FilterTenantDto, UpdateTenantDto } from "./dto/payload.dto";
import { TenantDetailDto, TenantDto } from "./dto/response.dto";
import { customizeException, handleSearchConditions } from "src/shared/utils/handlers";
import { plainToInstance } from "class-transformer";
import { RoleGroup } from "src/shared/enums/role-group.enum";

@Injectable()
export class TenantsService {
    constructor(
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }
    async getAll(filterDto: FilterTenantDto, /*#TODO user: User*/): Promise<[TenantDto[], number]> {
        const { search, page = 1, pageSize = 10, orderBy, orderDirection, isActive } = filterDto
        const skip = (page - 1) * pageSize;


        const searchConditions = handleSearchConditions<Tenant>(search, ['name', 'fullBrandName', 'tenantUrlTag']);

        const customWhereOptions: FindOptionsWhere<Tenant>[] = [...searchConditions];

        if (typeof isActive === 'boolean') {
            customWhereOptions.push({ isActive });
        }

        const [tenants, total] = await this.tenantRepository.findAndCount({
            where: customWhereOptions.length > 0 ? customWhereOptions : {},
            skip,
            take: pageSize,
            order: { [orderBy]: orderDirection },
        });

        const tenantsToResponse = plainToInstance(TenantDto, tenants, { excludeExtraneousValues: true });
        return [tenantsToResponse, total];
    }

    async get(id: string): Promise<TenantDetailDto> {
        const tenant = await this.tenantRepository.findOne({ where: { id }, relations: { admin: true, users: true } })
        if (tenant) {
            return plainToInstance(TenantDetailDto, tenant, { excludeExtraneousValues: true });
        }
        throw new HttpException(`Tenant with ID ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    async create(createTenantDto: CreateTenantDto): Promise<TenantDetailDto> {
        const { adminId } = createTenantDto
        const tenantAdmin = await this.userRepository.findOne({ where: { id: adminId } })
        if (!tenantAdmin) {
            throw new HttpException(`Admin with ID ${adminId} is not found`, HttpStatus.NOT_FOUND);
        }
        if (tenantAdmin.tenant) {
            throw new HttpException(`Admin User is already assigned to a tenant`, HttpStatus.CONFLICT);
        }
        try {
            const createdTenant = await this.tenantRepository.save({ ...createTenantDto, admin: tenantAdmin }) // #TEST -- tum bilgiler kayit oluyor mu
            return plainToInstance(TenantDetailDto, createdTenant, { excludeExtraneousValues: true });
        } catch (err) {
            return customizeException(err, { entity: "Tenant" })
        }
    }

    async update(id: string, updateTenantDto: UpdateTenantDto): Promise<TenantDetailDto> {
        const tenantToUpdate = await this.tenantRepository.findOne({ where: { id }, relations: { admin: true, users: true } })
        if (tenantToUpdate) {
            const { adminId, ...tenantData } = updateTenantDto
            const tenantAdmin = await this.userRepository.findOne({ where: { id: adminId } })
            if (!tenantAdmin) {
                throw new HttpException(`Admin with ID ${adminId} is not found`, HttpStatus.NOT_FOUND);
            }
            try {
                const tenant = plainToInstance(Tenant, { admin: tenantAdmin, ...tenantToUpdate, ...tenantData });
                const updatedTenant = await this.tenantRepository.save(tenant);
                return plainToInstance(TenantDetailDto, updatedTenant, { excludeExtraneousValues: true });
            } catch (err) {
                return customizeException(err, { entity: "Tenant", id })
            }
        }
        throw new HttpException(`Tenant with id ${id} not found`, HttpStatus.NOT_FOUND);
    }

    async delete(id: string): Promise<void> {
        const deleteToTenant = await this.tenantRepository.findOne({ where: { id } })
        if (!deleteToTenant) {
            throw new HttpException(`Tenant with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        const usersofTenant = await this.userRepository.find({ where: { tenant: { id } }, select: { role: { group: true } } })
        const usersWillbeDelete = usersofTenant.filter(user => RoleGroup.Admin != user.role.group)
        const usersWillbeInActive = usersofTenant.filter(user => RoleGroup.Admin == user.role.group)
        if (usersWillbeDelete.length) {
            await this.userRepository.remove(usersWillbeDelete)
            usersWillbeInActive.forEach(user => { user.isActive = false })
            await this.userRepository.save(usersWillbeInActive)
        }
        await this.tenantRepository.softRemove(deleteToTenant)
        return
    }
}
