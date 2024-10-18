import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPartnerProjectDescriptionAndSocialLinks1682667908317 implements MigrationInterface {
  name = 'addPartnerProjectDescriptionAndSocialLinks1682667908317';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner_project" ADD "projectDescription" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner_project" ADD "socialDescription" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_project" DROP COLUMN "socialDescription"`);
    await queryRunner.query(`ALTER TABLE "partner_project" DROP COLUMN "projectDescription"`);
  }
}
