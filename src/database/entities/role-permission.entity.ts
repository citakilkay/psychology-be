import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Permission, Role } from "./index";

@Entity()
export class RolePermission {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => Role, (role) => role.rolePermissions)
    role: Role;

    @ManyToOne(() => Permission, (permission) => permission.rolePermissions) // Removed inverseSide reference
    permission: Permission;

    @Column({ default: false })
    isActive: boolean; // Field to indicate whether the permission is assigned
}
