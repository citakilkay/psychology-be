import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class EntityBase {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn({ nullable: false })
    createdAt: Date

    @UpdateDateColumn()
    updatedAt?: Date

    @DeleteDateColumn()
    deletedAt?: Date;
}