import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTokenRewatds1676552456634 implements MigrationInterface {
  name = 'createTokenRewatds1676552456634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "token" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "symbol" character varying NOT NULL, "logo" character varying, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "token_amount_reward" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL, "tokenId" integer NOT NULL, "rewardId" integer NOT NULL, CONSTRAINT "PK_5cf42c895888c74c8bb266bae17" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reward" ("id" SERIAL NOT NULL, "startPlace" numeric NOT NULL, "endPlace" numeric NOT NULL, "whitelistng" boolean NOT NULL DEFAULT false, "loyaltyProjectId" integer, CONSTRAINT "PK_a90ea606c229e380fb341838036" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "tokensAmount"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "alTokensAmountReward" numeric NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "shortDescription" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "backgroundImage" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "previewImage" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "token_amount_reward" ADD CONSTRAINT "FK_5a676f39181be7b72dfcf527fae" FOREIGN KEY ("tokenId") REFERENCES "token"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "token_amount_reward" ADD CONSTRAINT "FK_47559f0ef20d24d0a7098e0aedd" FOREIGN KEY ("rewardId") REFERENCES "reward"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reward" ADD CONSTRAINT "FK_0ea592481b8d51493bdc7acf907" FOREIGN KEY ("loyaltyProjectId") REFERENCES "loyalty_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reward" DROP CONSTRAINT "FK_0ea592481b8d51493bdc7acf907"`);
    await queryRunner.query(`ALTER TABLE "token_amount_reward" DROP CONSTRAINT "FK_47559f0ef20d24d0a7098e0aedd"`);
    await queryRunner.query(`ALTER TABLE "token_amount_reward" DROP CONSTRAINT "FK_5a676f39181be7b72dfcf527fae"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "previewImage" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "backgroundImage" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "shortDescription" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "alTokensAmountReward"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "tokensAmount" numeric NOT NULL DEFAULT '0'`);
    await queryRunner.query(`DROP TABLE "reward"`);
    await queryRunner.query(`DROP TABLE "token_amount_reward"`);
    await queryRunner.query(`DROP TABLE "token"`);
  }
}
