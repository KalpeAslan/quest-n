import { MigrationInterface, QueryRunner } from 'typeorm';

export class LoyaltyTaskTableAddNewBridgeTaskType1689665889087 implements MigrationInterface {
  name = 'LoyaltyTaskTableAddNewBridgeTaskType1689665889087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum" RENAME TO "loyalty_task_type_enum_old"`);
    await queryRunner.query(
      `CREATE TYPE "public"."loyalty_task_type_enum" AS ENUM('visitLink', 'medium', 'referralLink', 'quiz', 'suggestion', 'email', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter', 'reTweetQuoteTwitter', 'checkSpaceTwitter', 'joinDiscord', 'roleDiscord', 'partner', 'joinTelegram', 'signUp', 'watchVideo', 'completedOnboarding', 'token', 'nft', 'blockchainUser', 'valueHolder', 'nativeHolder', 'daily', 'customWebhook', 'dexLiquidityProvider', 'imageUpload', 'invite', 'bridge')`,
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum" USING "type"::"text"::"public"."loyalty_task_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loyalty_project" ALTER COLUMN "body" SET DEFAULT '{"luckyDrawRewards": {"rewards": [], "minTokenAmount": 0, "eligibleUsersCount": 0, "luckyDrawThreshold": 0}, "scoreboardRewards": {"rewards": [], "minTokenAmount": 0}}'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."loyalty_task_type_enum_old" AS ENUM('visitLink', 'medium', 'referralLink', 'quiz', 'suggestion', 'email', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter', 'reTweetQuoteTwitter', 'checkSpaceTwitter', 'joinDiscord', 'roleDiscord', 'partner', 'joinTelegram', 'signUp', 'watchVideo', 'completedOnboarding', 'token', 'nft', 'blockchainUser', 'valueHolder', 'nativeHolder', 'daily', 'customWebhook', 'dexLiquidityProvider', 'imageUpload', 'invite')`,
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum_old" USING "type"::"text"::"public"."loyalty_task_type_enum_old"`,
    );
  }
}
