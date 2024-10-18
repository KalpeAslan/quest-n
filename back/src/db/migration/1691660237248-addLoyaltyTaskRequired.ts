import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLoyaltyTaskRequired1691660237248 implements MigrationInterface {
  name = 'addLoyaltyTaskRequired1691660237248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_task" ADD "required" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_task" DROP COLUMN "required"`);
  }
}
