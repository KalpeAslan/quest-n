import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveTablesRewardTokensAmountReward1685628802424 implements MigrationInterface {
  name = 'RemoveTablesRewardTokensAmountReward1685628802424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reward" CASCADE`);
    await queryRunner.query(`DROP TABLE "token_amount_reward" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reward" ("id" SERIAL NOT NULL, "startPlace" numeric NOT NULL, "endPlace" numeric NOT NULL, "whitelistng" boolean NOT NULL DEFAULT false, "loyaltyProjectId" integer, CONSTRAINT "PK_a90ea606c229e380fb341838036" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "token_amount_reward" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL, "tokenId" integer NOT NULL, "rewardId" integer NOT NULL, CONSTRAINT "PK_5cf42c895888c74c8bb266bae17" PRIMARY KEY ("id"))`,
    );
  }
}
