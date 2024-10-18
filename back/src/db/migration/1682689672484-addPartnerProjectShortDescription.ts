import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPartnerProjectShortDescription1682689672484 implements MigrationInterface {
  name = 'addPartnerProjectShortDescription1682689672484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_project" ADD "shortDescription" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_project" DROP COLUMN "shortDescription"`);
  }
}
