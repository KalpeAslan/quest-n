import { MigrationInterface, QueryRunner } from 'typeorm';

export class lastCompletedAt1680968532232 implements MigrationInterface {
  lastCompletedAt = 'lastCompletedAt1680968532232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quest_progress" ADD "lastCompletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quest_progress" DROP COLUMN "lastCompletedAt"`);
  }
}
