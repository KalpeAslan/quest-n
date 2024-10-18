import {MigrationInterface, QueryRunner} from "typeorm";

export class addedSuggestionTaskType1662986130765 implements MigrationInterface {
    name = 'addedSuggestionTaskType1662986130765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."loyalty_task_schedule_enum" AS ENUM('daily', 'weekly')`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" ADD "schedule" "public"."loyalty_task_schedule_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum" RENAME TO "loyalty_task_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."loyalty_task_type_enum" AS ENUM('visitLink', 'referralLink', 'fullfiled', 'suggestion', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter')`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum" USING "type"::"text"::"public"."loyalty_task_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."loyalty_task_type_enum_old" AS ENUM('visitLink', 'referralLink', 'fullfiled', 'followTwitter', 'mentionTwitter', 'tweetTwitter', 'reTweetTwitter')`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" ALTER COLUMN "type" TYPE "public"."loyalty_task_type_enum_old" USING "type"::"text"::"public"."loyalty_task_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."loyalty_task_type_enum_old" RENAME TO "loyalty_task_type_enum"`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" DROP COLUMN "schedule"`);
        await queryRunner.query(`DROP TYPE "public"."loyalty_task_schedule_enum"`);
    }

}
