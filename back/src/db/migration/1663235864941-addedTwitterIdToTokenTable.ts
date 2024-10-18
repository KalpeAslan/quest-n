import {MigrationInterface, QueryRunner} from "typeorm";

export class addedTwitterIdToTokenTable1663235864941 implements MigrationInterface {
    name = 'addedTwitterIdToTokenTable1663235864941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "twitter_token" ADD "twitterId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "twitter_token" DROP COLUMN "twitterId"`);
    }

}
