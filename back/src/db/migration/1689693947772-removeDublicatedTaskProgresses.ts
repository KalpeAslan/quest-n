import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeDublicatedTaskProgresses1689693947772 implements MigrationInterface {
  name = 'removeDublicatedTaskProgresses1689693947772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM
                "task_progress" a
                    USING "task_progress" b
            WHERE
                (a."earnedPoints"<b."earnedPoints" OR a."completedAt" < b."completedAt" OR a."createdDate"<b."createdDate")
                AND a."investorId" = b."investorId" AND a."loyaltyTaskId"=b."loyaltyTaskId";
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
