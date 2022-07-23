import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class Tenant {
  @PrimaryColumn()
  host: string;

  @PrimaryColumn()
  name: string;
}
