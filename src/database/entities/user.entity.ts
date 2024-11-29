import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { Role } from "./role.entity";

@Entity()
export class User extends EntityBase {
    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column({ unique: true })
    emailAddress: string;

    @Column({ nullable: false })
    password: string;

    @Column({ default: false })
    isActive: boolean;
    @ManyToOne(() => Role, (role) => role.users)
    role: Role
}
