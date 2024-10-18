import { MigrationInterface, QueryRunner } from 'typeorm';

export class LoyaltyProjectRenameProjectDescriptionToDescription1691655493639 implements MigrationInterface {
  name = 'LoyaltyProjectRenameProjectDescriptionToDescription1691655493639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "shortDescription"`);
    await queryRunner.query('ALTER TABLE "loyalty_project" RENAME COLUMN "projectDescription" TO "description"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "shortDescription" character varying`);
    await queryRunner.query('ALTER TABLE "loyalty_project" RENAME COLUMN "description" TO "projectDescription"');
  }
}
