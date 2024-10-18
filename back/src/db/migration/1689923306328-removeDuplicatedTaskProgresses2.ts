import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeDuplicatedTaskProgresses21689923306328 implements MigrationInterface {
  name = 'removeDuplicatedTaskProgresses21689923306328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM
            "task_progress" a
                USING "task_progress" b
        WHERE
            (a."earnedPoints"<b."earnedPoints" OR a."completedAt" < b."completedAt" OR a."createdDate"<b."createdDate" OR a."id"<b."id")
            AND a."investorId" = b."investorId" AND a."loyaltyTaskId"=b."loyaltyTaskId";
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
