import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedInvestorIntoQuestProgress1687944369713 implements MigrationInterface {
  name = 'addedInvestorIntoQuestProgress1687944369713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_name = 'quest_progress'
        ) THEN
          ALTER TABLE "quest_progress" ADD COLUMN IF NOT EXISTS "questInvitationCode" character varying;
          ALTER TABLE "quest_progress" ADD COLUMN IF NOT EXISTS "questInviterinvestorId" integer;
          ALTER TABLE "quest_progress" DROP CONSTRAINT IF EXISTS "FK_1d2a4542c1e60936858caeadaf8";
          ALTER TABLE "quest_progress" ADD CONSTRAINT "FK_1d2a4542c1e60936858caeadaf8" FOREIGN KEY ("questInviterinvestorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quest_progress" DROP CONSTRAINT "FK_1d2a4542c1e60936858caeadaf8"`);
    await queryRunner.query(`ALTER TABLE "quest_progress" DROP COLUMN "questInviterinvestorId"`);
    await queryRunner.query(`ALTER TABLE "quest_progress" DROP COLUMN "questInvitationCode"`);
  }
}
