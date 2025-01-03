import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { RoleGroup } from "src/shared/enums/role-group.enum";
import { Permission } from "./permission.entity";
import { User } from "./user.entity";

@Entity()
export class Role extends EntityBase {
    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ nullable: false, type: "enum", enum: RoleGroup })
    group: RoleGroup;

    @ManyToMany(() => Permission)
    @JoinTable()
    permissions: Permission[]

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
