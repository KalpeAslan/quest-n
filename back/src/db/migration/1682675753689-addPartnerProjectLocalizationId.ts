import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPartnerProjectLocalizationId1682675753689 implements MigrationInterface {
  name = 'addPartnerProjectLocalizationId1682675753689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_project" ADD "localizationId" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_project" DROP COLUMN "localizationId"`);
  }
}
