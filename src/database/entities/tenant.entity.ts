import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { EntityBase } from "./common/base.entity";
import { User } from ".";
import { IsEmail, IsOptional, IsPhoneNumber } from "class-validator";

export class ContactInfo {
    website: string;
    socialMedia?: {
        instagramUsername?: string;
        mediumUsername?: string;
    }
    firstName?: string;
    lastName?: string;
    @IsOptional()
    @IsEmail({}, { message: 'Email Address is invalid' })
    emailAddress?: string;
    @IsOptional()
    @IsPhoneNumber(null, { message: 'Invalid phone number' })
    phoneNumber?: string;
    address?: {
        mapLink?: string; // #TODO --  long and lat tut, link yerine
        addressinText?: string;
    };
};
@Entity()
export class Tenant extends EntityBase {
    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ unique: true, nullable: false })
    fullBrandName: string;

    @Column({ unique: true, nullable: false })
    tenantUrlTag: string;

    @OneToMany(() => User, (user) => user.tenant, { cascade: ['insert', 'update', 'recover'] })
    users: User[];

    @OneToOne(() => User, { cascade: true, onDelete: 'RESTRICT', nullable: true }) // #TEST -- tenant'in default adminini silmeden once default admine baska bir admini ata
    @JoinColumn() // This makes it a FK in the Tenant table
    admin?: User;

    @Column({ type: 'jsonb', default: {} })
    contactInfo?: ContactInfo;

    @Column({ default: true })
    isActive: boolean;

    // #TODO tenant.setup -- currency falan -profit model falan - kiralama mi comission mu
}