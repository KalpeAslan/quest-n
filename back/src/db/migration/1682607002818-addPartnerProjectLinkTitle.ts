import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPartnerProjectLinkTitle1682607002818 implements MigrationInterface {
  name = 'addPartnerProjectLinkTitle1682607002818';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_project" ADD "linkTitle" character varying`);
    await queryRunner.query(
      `ALTER TABLE "partner_project" ADD CONSTRAINT "UQ_b7d991e125e885c369fd3ed4863" UNIQUE ("linkTitle")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_project" DROP CONSTRAINT "UQ_b7d991e125e885c369fd3ed4863"`);
    await queryRunner.query(`ALTER TABLE "partner_project" DROP COLUMN "linkTitle"`);
  }
}
