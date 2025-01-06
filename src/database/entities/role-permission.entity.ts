import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Permission, Role } from "./index";

@Entity()
export class RolePermission {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
    role: Role;

    @ManyToOne(() => Permission, { onDelete: 'CASCADE' }) // Removed inverseSide reference
    permission: Permission;

    @Column({ default: false })
    isActive: boolean; // Field to indicate whether the permission is assigned
}
