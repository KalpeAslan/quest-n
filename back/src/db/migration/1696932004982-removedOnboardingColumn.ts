import { MigrationInterface, QueryRunner } from 'typeorm';

export class removedOnboardingColumn1696932004982 implements MigrationInterface {
  name = 'removedOnboardingColumn1696932004982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE loyalty_task
        DROP COLUMN "isOnboarding";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
}
