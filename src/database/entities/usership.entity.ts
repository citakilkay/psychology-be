import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { User } from ".";

@Entity()
export class Usership {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: true })
    lastLoginDate?: Date;

    @Column({ nullable: true })
    @Exclude()
    hashedRefreshToken?: string;

    @UpdateDateColumn()
    updatedAt?: Date;

    @OneToOne(() => User, user => user.usership)
    user: User;

    @Column({ nullable: true })
    lastTokenRefreshDate?: Date;

}