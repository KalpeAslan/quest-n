import { MigrationInterface, QueryRunner } from 'typeorm';

export class linkTitle1652079120997 implements MigrationInterface {
  name = 'linkTitle1652079120997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" ADD "linkTitle" character varying`);
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "UQ_3b7baf71160dc94a5ce7cfc0bdb" UNIQUE ("linkTitle")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "UQ_3b7baf71160dc94a5ce7cfc0bdb"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "linkTitle"`);
  }
}
