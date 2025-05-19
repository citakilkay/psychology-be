import { Column, Entity, Index, ManyToOne, OneToMany, Unique } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { RolePermission } from "./role-permission.entity";

@Entity()
@Unique('unique_name_within_parent', ['name', 'parent'])
export class Permission extends EntityBase {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: false })
    isDefault: boolean;

    @Column({ default: true })
    isEditable: boolean;

    @ManyToOne(() => Permission, (permission) => permission.childPermissions, { nullable: true })
    @Index()
    parent?: Permission;

    @OneToMany(() => Permission, permission => permission.parent, { cascade: true }) // #TEST -- sikinti cikarsa softremove yap
    childPermissions: Permission[];

    @OneToMany(() => RolePermission, rolePermission => rolePermission.permission, { cascade: true })
    rolePermissions: RolePermission[];

    getAppPermission(): string {
        const parentName = this.parent?.name;
        return parentName ? `${parentName}:${this.name}` : `${this.name}:Default`;
    }
}
