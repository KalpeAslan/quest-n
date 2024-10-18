import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeLoyaltyRewardTable1693907025325 implements MigrationInterface {
  name = 'changeLoyaltyRewardTable1693907025325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_reward" ADD "verified" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "loyalty_reward" ADD "tokenIds" jsonb`);
    await queryRunner.query(`ALTER TABLE "loyalty_reward" RENAME COLUMN "tokenId" TO "contractId";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_reward" RENAME COLUMN "contractId" TO "tokenId";`);
    await queryRunner.query(`ALTER TABLE "loyalty_reward" DROP COLUMN "tokenIds";`);
    await queryRunner.query(`ALTER TABLE "loyalty_reward" DROP COLUMN "verified";`);
  }
}
