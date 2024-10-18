import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoyaltyProjectTokensEarnRule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('numeric', {
    nullable: false,
  })
  startPlace!: number;

  @Column('numeric', {
    nullable: false,
  })
  endPlace!: number;

  @Column('numeric', {
    nullable: false,
  })
  profit!: number;
}
