import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedIsOnboardingColumnIntoTask1696918417008 implements MigrationInterface {
  name = 'addedIsOnboardingColumnIntoTask1696918417008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE loyalty_task
        ADD COLUMN "isOnboarding" BOOLEAN DEFAULT false;
    `);

    await queryRunner.query(`
        UPDATE loyalty_task
        SET "isOnboarding" = TRUE
        WHERE (body->>'isOnboardingTask')::BOOLEAN IS TRUE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE loyalty_task
        DROP COLUMN "isOnboarding";
    `);
  }
}
