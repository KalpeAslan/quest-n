import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLoyaltyProjectTokensEarnTokensTokensStorage1672835179184 implements MigrationInterface {
  name = 'addLoyaltyProjectTokensEarnTokensTokensStorage1672835179184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tokens_storage" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "investorId" integer NOT NULL, CONSTRAINT "REL_3bf7a59c50b819a0c170f5548e" UNIQUE ("investorId"), CONSTRAINT "PK_142cd050fe21b0382aaa8e694cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tokens_storage_history_type_enum" AS ENUM('loyaltyProject', 'referral')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tokens_storage_history" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "type" "public"."tokens_storage_history_type_enum" NOT NULL, "tokenSotrageId" integer NOT NULL, "loyaltyProjectId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d4ce2c6c409a6cdc4a8ea558b5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "referral_info_history" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "referralInfoId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3b05d86b228fb406df343165b11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "referral_ranks_rule" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "tokensFrom" numeric NOT NULL, "profit" numeric NOT NULL, CONSTRAINT "PK_700e5f111cfdc33da005743a6f1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "loyalty_project_tokens_earn_rule" ("id" SERIAL NOT NULL, "totalUsers" numeric NOT NULL, "rules" jsonb NOT NULL, CONSTRAINT "UQ_f03099e9f664ebbc2eaa100890f" UNIQUE ("totalUsers"), CONSTRAINT "PK_c4a75e9b68733e1c3c0aa95580c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "investor_levels_rule" ("id" SERIAL NOT NULL, "number" numeric NOT NULL, "tokensFrom" numeric NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_6f833315fcc6f787bfc5e24e486" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "referral_info" ADD "availableToClaim" numeric NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "referral_info" ADD "monthlyReferralVolume" numeric NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "referral_info" ADD "referrersGroupIds" integer array NOT NULL DEFAULT '{}'`);
    await queryRunner.query(`ALTER TABLE "referral_info" ADD "referralRankReachedVolume" numeric NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "referral_info" ADD "referralRanksRuleId" integer`);
    await queryRunner.query(`ALTER TABLE "referral_info" ALTER COLUMN "code" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "tokens_storage" ADD CONSTRAINT "FK_3bf7a59c50b819a0c170f5548ea" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens_storage_history" ADD CONSTRAINT "FK_533852c55120bc66f8ca115bea2" FOREIGN KEY ("tokenSotrageId") REFERENCES "tokens_storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens_storage_history" ADD CONSTRAINT "FK_7c4ddccf486c15ccdae4c53acf9" FOREIGN KEY ("loyaltyProjectId") REFERENCES "loyalty_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_info_history" ADD CONSTRAINT "FK_80708c8d29d583ce76dcec85223" FOREIGN KEY ("referralInfoId") REFERENCES "referral_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral_info" ADD CONSTRAINT "FK_781930048dc1170af50883be738" FOREIGN KEY ("referralRanksRuleId") REFERENCES "referral_ranks_rule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "referral_info" DROP CONSTRAINT "FK_781930048dc1170af50883be738"`);
    await queryRunner.query(`ALTER TABLE "referral_info_history" DROP CONSTRAINT "FK_80708c8d29d583ce76dcec85223"`);
    await queryRunner.query(`ALTER TABLE "tokens_storage_history" DROP CONSTRAINT "FK_7c4ddccf486c15ccdae4c53acf9"`);
    await queryRunner.query(`ALTER TABLE "tokens_storage_history" DROP CONSTRAINT "FK_533852c55120bc66f8ca115bea2"`);
    await queryRunner.query(`ALTER TABLE "tokens_storage" DROP CONSTRAINT "FK_3bf7a59c50b819a0c170f5548ea"`);
    await queryRunner.query(`ALTER TABLE "referral_info" ALTER COLUMN "code" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "referral_info" DROP COLUMN "referralRanksRuleId"`);
    await queryRunner.query(`ALTER TABLE "referral_info" DROP COLUMN "referralRankReachedVolume"`);
    await queryRunner.query(`ALTER TABLE "referral_info" DROP COLUMN "referrersGroupIds"`);
    await queryRunner.query(`ALTER TABLE "referral_info" DROP COLUMN "monthlyReferralVolume"`);
    await queryRunner.query(`ALTER TABLE "referral_info" DROP COLUMN "availableToClaim"`);
    await queryRunner.query(`DROP TABLE "investor_levels_rule"`);
    await queryRunner.query(`DROP TABLE "loyalty_project_tokens_earn_rule"`);
    await queryRunner.query(`DROP TABLE "referral_ranks_rule"`);
    await queryRunner.query(`DROP TABLE "referral_info_history"`);
    await queryRunner.query(`DROP TABLE "tokens_storage_history"`);
    await queryRunner.query(`DROP TYPE "public"."tokens_storage_history_type_enum"`);
    await queryRunner.query(`DROP TABLE "tokens_storage"`);
  }
}
