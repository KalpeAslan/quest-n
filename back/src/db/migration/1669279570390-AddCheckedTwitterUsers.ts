import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCheckedTwitterUsers1669279570390 implements MigrationInterface {
    name = 'AddCheckedTwitterUsers1669279570390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "checked_twitter_users" ("id" SERIAL NOT NULL, "twitterId" character varying NOT NULL, "score" numeric NOT NULL, CONSTRAINT "PK_3253501eada297d819723edd0e4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "checked_twitter_users"`);
    }

}
