import { Column, Entity, JoinColumn, ManyToOne, OneToOne, UpdateDateColumn } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { Role } from "./role.entity";
import { Exclude } from "class-transformer";
import { Usership } from "./usership.entity";
import { Tenant } from ".";

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

    @OneToOne(() => Usership, usership => usership.user, { cascade: true })
    @JoinColumn()
    usership: Usership;

    @ManyToOne(() => Tenant, (tenant) => tenant.users, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    tenant?: Tenant;
    // #TODO: last login date
}
