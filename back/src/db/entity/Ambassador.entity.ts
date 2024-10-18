import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EAmbassadorMethods } from '../types/interfaces/ambassador.types';

@Entity()
export class Ambassador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    unique: true,
    nullable: true,
  })
  contact: string;

  @Column('varchar', {
    nullable: true,
    default: null,
  })
  method: EAmbassadorMethods;
}
