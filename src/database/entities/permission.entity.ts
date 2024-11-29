import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "./common/base.entity";

@Entity()
export class Permission extends EntityBase {
    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ default: true })
    isEditable: boolean;

    @Column({ nullable: true })
    parent?: Permission;

    @OneToMany(_type => Permission, permission => permission.parent, { cascade: ['soft-remove'] })
    childPermissions: Permission[] = []
}
