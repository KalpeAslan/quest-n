import { MigrationInterface, QueryRunner } from 'typeorm';

export class addComplitedFiedToLoyaltyProject1670927493122 implements MigrationInterface {
  name = 'addComplitedFiedToLoyaltyProject1670927493122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "complited" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "tokensAmount" numeric NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "tokensAmount"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "complited"`);
  }
}
