import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatedInvestorAddedTwitterAndDiscordUsers1670930337972 implements MigrationInterface {
  name = 'updatedInvestorAddedTwitterAndDiscordUsers1670930337972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "twitter_user" ("id" SERIAL NOT NULL, "twitterId" character varying NOT NULL, "twitterUsername" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "investorId" integer NOT NULL, CONSTRAINT "REL_a06b29eca647894493219871ff" UNIQUE ("investorId"), CONSTRAINT "PK_e988122f5fcd4e4ec0ba4a67784" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "discord_user" ("id" SERIAL NOT NULL, "discordId" character varying NOT NULL, "discordUsername" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "investorId" integer NOT NULL, CONSTRAINT "REL_f6e5f9f853571cc3e387194aa2" UNIQUE ("investorId"), CONSTRAINT "PK_2c465db058d41ca3a50f819b0a1" PRIMARY KEY ("id"))`,
    );
    // await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "nonce"`);
    await queryRunner.query(`ALTER TABLE "investor" ALTER COLUMN "wallet" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "twitter_user" ADD CONSTRAINT "FK_a06b29eca647894493219871ff2" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discord_user" ADD CONSTRAINT "FK_f6e5f9f853571cc3e387194aa2a" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "discord_user" DROP CONSTRAINT "FK_f6e5f9f853571cc3e387194aa2a"`);
    await queryRunner.query(`ALTER TABLE "twitter_user" DROP CONSTRAINT "FK_a06b29eca647894493219871ff2"`);
    await queryRunner.query(`ALTER TABLE "investor" ALTER COLUMN "wallet" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "investor" ADD "nonce" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    await queryRunner.query(`DROP TABLE "discord_user"`);
    await queryRunner.query(`DROP TABLE "twitter_user"`);
  }
}
