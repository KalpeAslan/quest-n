import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameComlitedColumn1683649084099 implements MigrationInterface {
  name = 'renameComlitedColumn1683649084099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" RENAME COLUMN "complited" TO "completed"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" RENAME COLUMN "completed" TO "complited"`);
  }
}
