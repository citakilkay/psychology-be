import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { RoleGroup } from "src/shared/enums/role-group.enum";
import { User } from "./user.entity";
import { RolePermission } from ".";

@Entity()
export class Role extends EntityBase {
    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ nullable: false, type: "enum", enum: RoleGroup })
    group: RoleGroup;

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    rolePermissions: RolePermission[];

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
