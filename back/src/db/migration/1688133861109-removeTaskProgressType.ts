import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeTaskProgressType1688133861109 implements MigrationInterface {
  name = 'removeTaskProgressType1688133861109';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_progress" DROP COLUMN type`);
    await queryRunner.query(`DROP TYPE "public"."task_progress_type_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."task_progress_type_enum" AS ENUM('daily', 'openQuiz', 'customWebhook', 'imageUpload', 'invite')`,
    );
    await queryRunner.query(`ALTER TABLE "task_progress" ADD "type" task_progress_type_enum`);
  }
}
