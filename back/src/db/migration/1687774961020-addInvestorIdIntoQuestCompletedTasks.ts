import { MigrationInterface, QueryRunner } from 'typeorm';

export class addInvestorIdIntoQuestCompletedTasks1687773427728 implements MigrationInterface {
  name = 'addInvestorIdIntoQuestCompletedTasks1687773427728';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add investorId column to quest_completed_tasks table
    await queryRunner.query(`ALTER TABLE quest_completed_tasks ADD COLUMN "investorId" INT`);

    // Copy investorId values from quest_progress table
    await queryRunner.query(`
      UPDATE quest_completed_tasks
      SET "investorId" = (
        SELECT "investorId"
        FROM quest_progress
        WHERE quest_progress.id = "quest_completed_tasks"."questProgressId"
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes made in the "up" method
    await queryRunner.query(`ALTER TABLE quest_completed_tasks DROP COLUMN "investorId"`);
  }
}
