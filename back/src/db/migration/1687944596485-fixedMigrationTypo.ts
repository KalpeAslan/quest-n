import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixedMigrationTypo1687944596485 implements MigrationInterface {
  name = 'fixedMigrationTypo1687944596485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quest_progress" ADD COLUMN IF NOT EXISTS "questInviterInvestorId" integer`);
    await queryRunner.query(`ALTER TABLE "quest_progress" DROP COLUMN IF EXISTS "questInviterinvestorId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quest_progress" DROP COLUMN "questInviterInvestorId"`);
    await queryRunner.query(`ALTER TABLE "quest_progress" ADD "questInviterinvestorId" integer`);
  }
}
