import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeInvestorAnal1729354578812 implements MigrationInterface {
  name = 'removeInvestorAnal1729354578812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "analytics_id"`);
    await queryRunner.query(`ALTER TABLE "investor" ADD "analytics_id" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "analytics_id"`);
    await queryRunner.query(`ALTER TABLE "investor" ADD "analytics_id" character varying NOT NULL`);
  }
}
