import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission, Role, User } from '../entities';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async seed() {
        await this.createRoles();
        await this.createUsers();
    }

    createPermissions() {
        const permissions = [{
            name: "USER",
            description: 'User ',
            isDefault: true,
            isEditable: false,
        }, {}]
    }

    private async createRoles() {
        const roles = ['super admin', 'admin'];
        for (const roleName of roles) {
            const roleExists = await this.roleRepository.findOne({ where: { name: roleName } });
            if (!roleExists) {
                const role = this.roleRepository.create({ name: roleName });
                await this.roleRepository.save(role);
            }
        }
    }

    private async createUsers() {
        const superAdminRole = await this.roleRepository.findOne({ where: { name: 'super admin' } });
        const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });

        const users = [
            { username: 'superadmin', password: 'superadminpassword', role: superAdminRole },
            { username: 'admin', password: 'adminpassword', role: adminRole },
        ];

        for (const userData of users) {
            const userExists = await this.userRepository.findOne({ where: { username: userData.username } });
            if (!userExists) {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                const user = this.userRepository.create({
                    ...userData,
                    password: hashedPassword,
                });
                await this.userRepository.save(user);
            }
        }
    }
}
