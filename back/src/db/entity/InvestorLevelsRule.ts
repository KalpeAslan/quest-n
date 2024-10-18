import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InvestorLevelsRule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('numeric')
  number!: number;

  @Column('numeric')
  tokensFrom!: number;

  @Column('varchar')
  name!: string;

  @Column('varchar')
  avatar!: string;
}
