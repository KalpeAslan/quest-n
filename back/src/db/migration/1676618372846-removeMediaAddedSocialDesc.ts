import {MigrationInterface, QueryRunner} from "typeorm";

export class removeMediaAddedSocialDesc1676618372846 implements MigrationInterface {
    name = 'removeMediaAddedSocialDesc1676618372846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partner_project" DROP COLUMN "media"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "alTokensAmountReward"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "socialDescription" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "tokensAmount" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "tokensAmount"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "socialDescription"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "alTokensAmountReward" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "partner_project" ADD "media" jsonb NOT NULL`);
    }

}
