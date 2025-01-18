import { Column, Entity, Index, ManyToOne, OneToMany, Unique } from "typeorm";
import { EntityBase } from "./common/base.entity";

@Entity()
@Unique('unique_name_within_parent', ['name', 'parent'])
export class Permission extends EntityBase {
    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: false })
    isDefault: boolean;

    @Column({ default: true })
    isEditable: boolean;

    @ManyToOne(() => Permission, (permission) => permission.childPermissions, { nullable: true, onDelete: 'CASCADE' })
    @Index()
    parent?: Permission;

    @OneToMany(_type => Permission, permission => permission.parent, { cascade: ['remove'] }) // #TEST -- sikinti cikarsa softremove yap
    childPermissions: Permission[]
}
