import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestProgressRefCode1688563986782 implements MigrationInterface {
  name = 'addQuestProgressRefCode1688563986782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'quest_progress'
        ) THEN
          ALTER TABLE "quest_progress" ADD COLUMN IF NOT EXISTS "questInvitationCode" character varying;
          ALTER TABLE "quest_progress" ADD COLUMN IF NOT EXISTS "questInviterInvestorId" integer;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quest_progress" DROP COLUMN "questInviterInvestorId"`);
    await queryRunner.query(`ALTER TABLE "quest_progress" DROP COLUMN "questInvitationCode"`);
  }
}
