import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropReferralTables1686597249512 implements MigrationInterface {
  name = 'DropReferralTables1686597249512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "referral_info" CASCADE`);
    await queryRunner.query(`DROP TABLE "referral_info_history" CASCADE`);
    await queryRunner.query(`DROP TABLE "referral_ranks_rule" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "referral_info_history" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "referralInfoId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3b05d86b228fb406df343165b11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "referral_ranks_rule" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "tokensFrom" numeric NOT NULL, "profit" numeric NOT NULL, CONSTRAINT "PK_700e5f111cfdc33da005743a6f1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "referral_info" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "personalVolume" numeric NOT NULL DEFAULT '0', "groupVolume" numeric NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "investorId" integer NOT NULL, "referrerId" integer, CONSTRAINT "UQ_a29bc6d1ea5ff1eaddc3accb913" UNIQUE ("code"), CONSTRAINT "REL_d9a38c391151baeb8c1a8d06e8" UNIQUE ("investorId"), CONSTRAINT "PK_4ad7f235a2c04884fb4cdc1aad0" PRIMARY KEY ("id"))`,
    );
  }
}
