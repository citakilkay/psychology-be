import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tenant, User } from "src/database/entities";
import { Repository } from "typeorm";
import { FilterTenantDto } from "./dto/payload.dto";
import { TenantDto } from "./dto/response.dto";

@Injectable()
export class TenantsService {
    constructor(
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }
    async getAll(filterDto: FilterTenantDto, /*#TODO user: User*/): Promise<[TenantDto[], number]> {
        return
    }
}