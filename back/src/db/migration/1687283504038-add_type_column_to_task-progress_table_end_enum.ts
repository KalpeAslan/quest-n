import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeColumnToTaskProgressTableEndEnum1687283504038 implements MigrationInterface {
  name = 'AddTypeColumnToTaskProgressTableEndEnum1687283504038';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."task_progress_type_enum" AS ENUM('daily', 'openQuiz', 'customWebhook')`,
    );
    await queryRunner.query(`ALTER TABLE "task_progress" ADD "type" "public"."task_progress_type_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_progress" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."task_progress_type_enum"`);
  }
}
