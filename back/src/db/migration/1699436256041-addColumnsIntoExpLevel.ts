import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnsIntoExpLevel1699436256041 implements MigrationInterface {
  name = 'addColumnsIntoExpLevel1699436256041';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "experience_level" ADD "contractAddress" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(`ALTER TABLE "experience_level" ADD "chainId" character varying NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_level" DROP COLUMN "chainId"`);
    await queryRunner.query(`ALTER TABLE "experience_level" DROP COLUMN "contractAddress"`);
  }
}
