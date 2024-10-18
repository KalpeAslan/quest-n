import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTaskProgressTable1683547619386 implements MigrationInterface {
  name = 'AddedTaskProgressTable1683547619386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum" RENAME TO "loyalty_task_type_enum_old"`);
    await queryRunner.query(
      `CREATE TYPE "public"."loyalty_task_type_enum" AS ENUM('visitLink', 'medium', 'referralLink', 'fulfilled', 'suggestion', 'multipleSuggestion', 'email', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter', 'reTweetQuoteTwitter', 'checkSpaceTwitter', 'joinDiscord', 'roleDiscord', 'partner', 'joinTelegram', 'signUp', 'watchVideo', 'completedOnboarding', 'token', 'nft', 'blockchainUser', 'valueHolder', 'nativeHolder', 'daily')`,
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum" USING "type"::"text"::"public"."loyalty_task_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum_old"`);
    await queryRunner.query(
      `CREATE TABLE "task_progress" ("id" SERIAL NOT NULL, "earnedPoints" numeric NOT NULL DEFAULT '0', "earnedAdditionalPoints" numeric NOT NULL DEFAULT '0', "pointsPerLike" numeric NOT NULL DEFAULT '0', "pointsPerRetweet" numeric NOT NULL DEFAULT '0', "loyaltyProjectId" integer NOT NULL, "investorId" integer NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "completedAt" TIMESTAMP DEFAULT NULL, "json" jsonb NOT NULL, "loyaltyTaskId" integer NOT NULL, CONSTRAINT "PK_d3a98edef96427df8adb5feb8e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_progress" ADD CONSTRAINT "FK_d833957a7d525408dacd2b499a3" FOREIGN KEY ("loyaltyProjectId") REFERENCES "loyalty_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_progress" ADD CONSTRAINT "FK_01b1fa718733a6ede23aefbe2e6" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_progress" ADD CONSTRAINT "FK_e351a51e6a90dc07f30ad8dc9ad" FOREIGN KEY ("loyaltyTaskId") REFERENCES "loyalty_task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_progress" DROP CONSTRAINT "FK_e351a51e6a90dc07f30ad8dc9ad"`);
    await queryRunner.query(`ALTER TABLE "task_progress" DROP CONSTRAINT "FK_01b1fa718733a6ede23aefbe2e6"`);
    await queryRunner.query(`ALTER TABLE "task_progress" DROP CONSTRAINT "FK_d833957a7d525408dacd2b499a3"`);
    await queryRunner.query(`DROP TABLE "task_progress"`);
    await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum" RENAME TO "loyalty_task_type_enum_new"`);
    await queryRunner.query(
      `CREATE TYPE "public"."loyalty_task_type_enum" AS ENUM('visitLink', 'medium', 'referralLink', 'fulfilled', 'suggestion', 'multipleSuggestion', 'email', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter', 'reTweetQuoteTwitter', 'checkSpaceTwitter', 'joinDiscord', 'roleDiscord', 'partner', 'joinTelegram', 'signUp', 'watchVideo', 'completedOnboarding', 'token', 'nft', 'blockchainUser', 'valueHolder', 'nativeHolder')`,
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum" USING "type"::"text"::"public"."loyalty_task_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum_new"`);
  }
}
