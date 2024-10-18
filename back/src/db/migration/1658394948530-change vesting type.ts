import {MigrationInterface, QueryRunner} from "typeorm";

export class changeVestingType1658394948530 implements MigrationInterface {
    name = 'changeVestingType1658394948530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."social_task_socialmedia_enum" RENAME TO "social_task_socialmedia_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."social_task_socialmedia_enum" AS ENUM('facebook', 'twitter', 'instagram', 'telegram', 'discord', 'reddit', 'youtube', 'medium')`);
        await queryRunner.query(`ALTER TABLE "social_task" ALTER COLUMN "socialMedia" TYPE "public"."social_task_socialmedia_enum" USING "socialMedia"::"text"::"public"."social_task_socialmedia_enum"`);
        await queryRunner.query(`DROP TYPE "public"."social_task_socialmedia_enum_old"`);
        await queryRunner.query(`ALTER TABLE "sale" ALTER COLUMN "vesting" SET DEFAULT '[{"percentage":100,"claimDate":0}]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" ALTER COLUMN "vesting" SET DEFAULT '[100, 0]'`);
        await queryRunner.query(`CREATE TYPE "public"."social_task_socialmedia_enum_old" AS ENUM('facebook', 'twitter', 'instagram', 'telegram', 'discord', 'whitepaper', 'projectSite', 'reddit', 'youtube', 'medium')`);
        await queryRunner.query(`ALTER TABLE "social_task" ALTER COLUMN "socialMedia" TYPE "public"."social_task_socialmedia_enum_old" USING "socialMedia"::"text"::"public"."social_task_socialmedia_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."social_task_socialmedia_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."social_task_socialmedia_enum_old" RENAME TO "social_task_socialmedia_enum"`);
    }

}
