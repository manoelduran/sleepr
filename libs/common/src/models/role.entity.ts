import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../database/abstract.entity';

@Entity()
export class Role extends AbstractEntity<Role> {
  @Column()
  name: string;
}
