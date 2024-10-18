import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedSuggestion1669629337162 implements MigrationInterface {
    name = 'updatedSuggestion1669629337162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."suggestion_status_enum" AS ENUM('onReview', 'confirmed', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "suggestion" ADD "status" "public"."suggestion_status_enum"`);
        await queryRunner.query(`ALTER TABLE "suggestion" ADD "investorId" integer`);
        await queryRunner.query(`ALTER TABLE "suggestion" ADD "loyaltyTaskId" integer`);
        await queryRunner.query(`ALTER TABLE "suggestion" ADD "loyaltyProjectProgressId" integer`);
        await queryRunner.query(`ALTER TABLE "suggestion" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum" RENAME TO "loyalty_task_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."loyalty_task_type_enum" AS ENUM('visitLink', 'medium', 'referralLink', 'fulfilled', 'suggestion', 'multipleSuggestion', 'email', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter', 'reTweetQuoteTwitter', 'checkSpaceTwitter', 'joinDiscord', 'roleDiscord', 'partner', 'joinTelegram')`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum" USING "type"::"text"::"public"."loyalty_task_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "suggestion" ADD CONSTRAINT "FK_3c3e6d88ccc72c68ca8573e82fa" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suggestion" ADD CONSTRAINT "FK_c3b849b4678fbfeaf1fbfae6b2c" FOREIGN KEY ("loyaltyTaskId") REFERENCES "loyalty_task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suggestion" ADD CONSTRAINT "FK_c45a4dcc1fce4d832321b6a1237" FOREIGN KEY ("loyaltyProjectProgressId") REFERENCES "loyalty_project_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "suggestion" DROP CONSTRAINT "FK_c45a4dcc1fce4d832321b6a1237"`);
        await queryRunner.query(`ALTER TABLE "suggestion" DROP CONSTRAINT "FK_c3b849b4678fbfeaf1fbfae6b2c"`);
        await queryRunner.query(`ALTER TABLE "suggestion" DROP CONSTRAINT "FK_3c3e6d88ccc72c68ca8573e82fa"`);
        await queryRunner.query(`CREATE TYPE "public"."loyalty_task_type_enum_old" AS ENUM('visitLink', 'medium', 'referralLink', 'fulfilled', 'suggestion', 'email', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter', 'reTweetQuoteTwitter', 'checkSpaceTwitter', 'joinDiscord', 'roleDiscord', 'partner', 'joinTelegram')`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum_old" USING "type"::"text"::"public"."loyalty_task_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum_old" RENAME TO "loyalty_task_type_enum"`);
        await queryRunner.query(`ALTER TABLE "suggestion" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "suggestion" DROP COLUMN "loyaltyProjectProgressId"`);
        await queryRunner.query(`ALTER TABLE "suggestion" DROP COLUMN "loyaltyTaskId"`);
        await queryRunner.query(`ALTER TABLE "suggestion" DROP COLUMN "investorId"`);
        await queryRunner.query(`ALTER TABLE "suggestion" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."suggestion_status_enum"`);
    }

}
