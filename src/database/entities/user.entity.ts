import { Column, Entity } from "typeorm";
import { EntityBase } from "./common/base.entity";

@Entity()
export class User extends EntityBase {
    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ unique: true })
    emailAddress: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default: false })
    isActive: boolean;
}
