import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewTaskType_imageUpload1687421264040 implements MigrationInterface {
  name = 'AddNewTaskType_imageUpload1687421264040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."task_progress_type_enum" RENAME TO "task_progress_type_enum_old"`);
    await queryRunner.query(
      `CREATE TYPE "public"."task_progress_type_enum" AS ENUM('daily', 'openQuiz', 'customWebhook', 'imageUpload')`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_progress" ALTER COLUMN "type" TYPE "public"."task_progress_type_enum" USING "type"::"text"::"public"."task_progress_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."task_progress_type_enum_old"`);
    await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum" RENAME TO "loyalty_task_type_enum_old"`);
    await queryRunner.query(
      `CREATE TYPE "public"."loyalty_task_type_enum" AS ENUM('visitLink', 'medium', 'referralLink', 'fulfilled', 'suggestion', 'multipleSuggestion', 'email', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter', 'reTweetQuoteTwitter', 'checkSpaceTwitter', 'joinDiscord', 'roleDiscord', 'partner', 'joinTelegram', 'signUp', 'watchVideo', 'completedOnboarding', 'token', 'nft', 'blockchainUser', 'valueHolder', 'nativeHolder', 'daily', 'customWebhook', 'dexLiquidityProvider', 'imageUpload')`,
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum" USING "type"::"text"::"public"."loyalty_task_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."loyalty_task_type_enum_old" AS ENUM('blockchainUser', 'checkSpaceTwitter', 'completedOnboarding', 'customWebhook', 'daily', 'dexLiquidityProvider', 'email', 'followTwitter', 'fulfilled', 'joinDiscord', 'joinTelegram', 'medium', 'mentionTwitter', 'multipleSuggestion', 'nativeHolder', 'nft', 'partner', 'reTweetQuoteTwitter', 'reTweetTwitter', 'referralLink', 'roleDiscord', 'signUp', 'suggestion', 'token', 'tweetTwitter', 'valueHolder', 'visitLink', 'watchVideo')`,
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum_old" USING "type"::"text"::"public"."loyalty_task_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum_old" RENAME TO "loyalty_task_type_enum"`);
    await queryRunner.query(`ALTER TABLE "task_progress" ALTER COLUMN "type" SET NOT NULL`);
    await queryRunner.query(
      `CREATE TYPE "public"."task_progress_type_enum_old" AS ENUM('customWebhook', 'daily', 'openQuiz')`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_progress" ALTER COLUMN "type" TYPE "public"."task_progress_type_enum_old" USING "type"::"text"::"public"."task_progress_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."task_progress_type_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."task_progress_type_enum_old" RENAME TO "task_progress_type_enum"`);
  }
}
