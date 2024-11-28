import { Column, Entity } from "typeorm";
import { EntityBase } from "./common/base.entity";

@Entity()
export class Permission extends EntityBase {
    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ default: false })
    isEditable: boolean;
}
