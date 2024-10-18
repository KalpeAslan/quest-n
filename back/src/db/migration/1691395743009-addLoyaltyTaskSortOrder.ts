import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLoyaltyTaskSortOrder1691395743009 implements MigrationInterface {
  name = 'addLoyaltyTaskSortOrder1691395743009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_task" ADD "sortOrder" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_task" DROP COLUMN "sortOrder"`);
  }
}
