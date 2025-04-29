import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { User } from ".";

@Entity()
export class Tenant extends EntityBase {
    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ unique: true, nullable: false })
    fullBrandName: string;

    @Column({ unique: true, nullable: false })
    tenantUrlTag: string;

    @OneToMany(() => User, (user) => user.tenant)
    users: User[];

    @OneToOne(() => User, { cascade: true, onDelete: 'SET NULL', nullable: true })
    @JoinColumn() // This makes it a FK in the Tenant table
    admin?: User;

    @Column({ type: 'jsonb', default: {} })
    contactInfo?: ContactInfo;

    @Column({ default: true })
    isActive: boolean;
}

export type ContactInfo = {
    website: string;
    socialMedia?: {
        instagramUsername?: string;
        mediumUsername?: string;
    }
    firstName?: string;
    lastName?: string;
    emailAddress?: string;
    phoneNumber?: string;
    address?: {
        mapLink?: string;
        addressinText?: string;
    };
};