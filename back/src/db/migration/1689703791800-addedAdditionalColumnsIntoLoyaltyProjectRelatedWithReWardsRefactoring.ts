import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedAdditionalColumnsIntoLoyaltyProjectRelatedWithReWardsRefactoring1689703791800
  implements MigrationInterface
{
  name = 'addedAdditionalColumnsIntoLoyaltyProjectRelatedWithReWardsRefactoring1689703791800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "threshold" numeric DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "eligibleUsersCount" numeric DEFAULT null`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "threshold"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "eligibleUsersCount"`);
  }
}
