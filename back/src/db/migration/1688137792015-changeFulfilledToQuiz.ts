import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeFulfilledToQuiz1688137792015 implements MigrationInterface {
  name = 'changeFulfilledToQuiz1688137792015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE varchar`);
    await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum" RENAME TO "loyalty_task_type_enum_old"`);
    await queryRunner.query(
      `CREATE TYPE "public"."loyalty_task_type_enum" AS ENUM('visitLink', 'medium', 'referralLink', 'quiz', 'suggestion', 'email', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter', 'reTweetQuoteTwitter', 'checkSpaceTwitter', 'joinDiscord', 'roleDiscord', 'partner', 'joinTelegram', 'signUp', 'watchVideo', 'completedOnboarding', 'token', 'nft', 'blockchainUser', 'valueHolder', 'nativeHolder', 'daily', 'customWebhook', 'dexLiquidityProvider', 'imageUpload', 'invite')`,
    );
    await queryRunner.query(`DELETE FROM "loyalty_task" WHERE type='multipleSuggestion'`);
    await queryRunner.query(`UPDATE "loyalty_task" SET type='quiz' WHERE type='fulfilled'`);
    await queryRunner.query(
      `ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum" USING "type"::"text"::"public"."loyalty_task_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."loyalty_task_type_enum_old" AS ENUM('visitLink', 'medium', 'referralLink', 'fulfilled', 'suggestion', 'multipleSuggestion', 'email', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter', 'reTweetQuoteTwitter', 'checkSpaceTwitter', 'joinDiscord', 'roleDiscord', 'partner', 'joinTelegram', 'signUp', 'watchVideo', 'completedOnboarding', 'token', 'nft', 'blockchainUser', 'valueHolder', 'nativeHolder', 'daily', 'customWebhook', 'dexLiquidityProvider', 'imageUpload', 'invite')`,
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum_old" USING "type"::"text"::"public"."loyalty_task_type_enum_old"`,
    );
    await queryRunner.query(`UPDATE "loyalty_task" SET type='fulfilled' WHERE type='quiz'`);
    await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum_old" RENAME TO "loyalty_task_type_enum"`);
  }
}
