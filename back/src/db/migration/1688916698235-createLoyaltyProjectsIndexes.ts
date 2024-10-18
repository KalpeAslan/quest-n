import { MigrationInterface, QueryRunner } from 'typeorm';

export class createLoyaltyProjectsIndexes1688916698235 implements MigrationInterface {
  name = 'createLoyaltyProjectsIndexes1688916698235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX idx_task_progress_investor_id_loyalty_project_id ON "task_progress" ("investorId", "loyaltyProjectId")`,
    );
    await queryRunner.query(`CREATE INDEX idx_loyalty_project_startAt_endAt ON "loyalty_project" ("startAt", "endAt")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_task_progress_investor_id_loyalty_project_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_loyalty_project_startAt_endAt`);
  }
}
