import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeLoyaltyProjectLocalizationIdAndTokenAmount1686560245181 implements MigrationInterface {
  name = 'removeLoyaltyProjectLocalizationIdAndTokenAmount1686560245181';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "tokensAmount"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "localizationId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "localizationId" character varying`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "tokensAmount" numeric NOT NULL DEFAULT '0'`);
  }
}
