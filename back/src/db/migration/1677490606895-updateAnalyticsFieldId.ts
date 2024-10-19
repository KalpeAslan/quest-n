import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateAnalyticsFieldId1677490606895 implements MigrationInterface {
  name = 'updateAnalyticsFieldId1677490606895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" ADD "analytics_id" varchar`);
    // await queryRunner.query(`ALTER TABLE "investor" ALTER COLUMN "analytics_id" SET DEFAULT uuid_generate_v4()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "analytics_id"`);
    // await queryRunner.query(`ALTER TABLE "investor" ALTER COLUMN "analytics_id" DROP DEFAULT`);
  }
}
