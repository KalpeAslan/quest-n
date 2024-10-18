import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrationForExperienceLevel1699289267065 implements MigrationInterface {
  name = 'migrationForExperienceLevel1699289267065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_level" ADD "image" character varying NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "experience_level" ADD "benefits" jsonb NOT NULL DEFAULT '[]'::jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_level" DROP COLUMN "benefits"`);
    await queryRunner.query(`ALTER TABLE "experience_level" DROP COLUMN "image"`);
  }
}
