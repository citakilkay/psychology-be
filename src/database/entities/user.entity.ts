import { Column, Entity, ManyToOne } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { Role } from "./role.entity";
import { Exclude } from "class-transformer";

@Entity()
export class User extends EntityBase {
    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ unique: true, nullable: false })
    emailAddress: string;

    @Column({ nullable: false })
    @Exclude()
    password: string;

    @Column({ default: false })
    isActive: boolean = false;

    @ManyToOne(() => Role, (role) => role.users, { nullable: false })
    role: Role;
}
