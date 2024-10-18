import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNftImageColumn1699445558377 implements MigrationInterface {
  name = 'addNftImageColumn1699445558377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_level" ADD "nftImage" character varying NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_level" DROP COLUMN "nftImage"`);
  }
}
