import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateRewardsTable1690288577437 implements MigrationInterface {
  name = 'updateRewardsTable1690288577437';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('UPDATE "loyalty_reward" SET "startPlace" = 0 WHERE "startPlace" IS NULL');
    await queryRunner.query('UPDATE "loyalty_reward" SET "endPlace" = 0 WHERE "endPlace" IS NULL');

    await queryRunner.query('ALTER TABLE "loyalty_reward" ALTER COLUMN "startPlace" SET DEFAULT 0');
    await queryRunner.query('ALTER TABLE "loyalty_reward" ALTER COLUMN "endPlace" SET DEFAULT 0');
    await queryRunner.query('ALTER TABLE "loyalty_reward" ALTER COLUMN "startPlace" SET NOT NULL');
    await queryRunner.query('ALTER TABLE "loyalty_reward" ALTER COLUMN "endPlace" SET NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "loyalty_reward" ALTER COLUMN "startPlace" DROP NOT NULL');
    await queryRunner.query('ALTER TABLE "loyalty_reward" ALTER COLUMN "endPlace" DROP NOT NULL');
    await queryRunner.query('ALTER TABLE "loyalty_reward" ALTER COLUMN "startPlace" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "loyalty_reward" ALTER COLUMN "endPlace" DROP DEFAULT');
  }
}
