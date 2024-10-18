import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedHidProgressFieldToSale1657552978144 implements MigrationInterface {
  name = 'addedHidProgressFieldToSale1657552978144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sale" ADD "hideProgress" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "hideProgress"`);
  }
}
