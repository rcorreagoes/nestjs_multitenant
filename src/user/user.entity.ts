import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 50, nullable: false })
    name: string;
  
    @Column("varchar", { length: 200, nullable: true })
    password: string;
}
