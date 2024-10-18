import { MigrationInterface, QueryRunner } from 'typeorm';

export class createRewardsTableAndAddAdditionalFieldsIntoLoyaltyProject1689694713497 implements MigrationInterface {
  name = 'createRewardsTableAndAddAdditionalFieldsIntoLoyaltyProject1689694713497';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "rewards" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "amount" numeric NOT NULL DEFAULT 0,
            "isClaimable" boolean NOT NULL DEFAULT false,
            "description" varchar NOT NULL,
            "startPlace" numeric DEFAULT null,
            "endPlace" numeric DEFAULT null,
            "loyaltyProjectId" integer DEFAULT null,
            "tokenId" integer DEFAULT null
        )`);

    await queryRunner.query(`ALTER TABLE "rewards"
            ADD CONSTRAINT "FK_rewards_loyaltyProjectId" FOREIGN KEY ("loyaltyProjectId") REFERENCES "loyalty_project" ("id") ON DELETE CASCADE`);

    await queryRunner.query(`ALTER TABLE "rewards"
            ADD CONSTRAINT "FK_rewards_tokenId" FOREIGN KEY ("tokenId") REFERENCES "token" ("id") ON DELETE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rewards" DROP CONSTRAINT "FK_rewards_loyaltyProjectId"`);
    await queryRunner.query(`ALTER TABLE "rewards" DROP CONSTRAINT "FK_rewards_tokenId"`);
    await queryRunner.query(`DROP TABLE "rewards"`);
  }
}
