import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeTaskProgressEarnedAdditionalPoints1688469984603 implements MigrationInterface {
  name = 'removeTaskProgressEarnedAdditionalPoints1688469984603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "task_progress" SET "earnedPoints"="earnedPoints"+"earnedAdditionalPoints"`);
    await queryRunner.query(`ALTER TABLE "task_progress" DROP COLUMN "earnedAdditionalPoints"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_progress" ADD "earnedAdditionalPoints" numeric NOT NULL DEFAULT '0'`);
    await queryRunner.query(`UPDATE "task_progress" SET 
                                "earnedPoints"=lt."points", 
                                "earnedAdditionalPoints"="earnedPoints"-lt."points"
                            FROM "loyalty_task" as lt WHERE lt."id"="loyaltyTaskId"
                        `);
  }
}
