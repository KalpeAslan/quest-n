import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedBodyColumnToLoyaltyProject1684909235990 implements MigrationInterface {
  name = 'AddedBodyColumnToLoyaltyProject1684909235990';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loyalty_project" ADD "body" jsonb NOT NULL DEFAULT '{"minTokenAmount":0,"scoreboardRewards":[]}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "body"`);
  }
}
