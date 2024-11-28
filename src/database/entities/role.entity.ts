import { Column, Entity } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { RoleGroup } from "src/shared/enums/role-group.enum";

@Entity()
export class Role extends EntityBase {
    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ nullable: false, type: "enum", enum: RoleGroup })
    group: RoleGroup;
}
