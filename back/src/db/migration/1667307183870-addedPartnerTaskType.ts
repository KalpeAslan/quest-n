import {MigrationInterface, QueryRunner} from "typeorm";

export class addedPartnerTaskType1667307183870 implements MigrationInterface {
    name = 'addedPartnerTaskType1667307183870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum" RENAME TO "loyalty_task_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."loyalty_task_type_enum" AS ENUM('visitLink', 'referralLink', 'fulfilled', 'suggestion', 'email', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter', 'reTweetQuoteTwitter', 'joinDiscord', 'roleDiscord', 'partner')`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum" USING "type"::"text"::"public"."loyalty_task_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."loyalty_task_type_enum_old" AS ENUM('visitLink', 'referralLink', 'fulfilled', 'suggestion', 'email', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter', 'reTweetQuoteTwitter', 'joinDiscord', 'roleDiscord')`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum_old" USING "type"::"text"::"public"."loyalty_task_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum_old" RENAME TO "loyalty_task_type_enum"`);
    }

}
