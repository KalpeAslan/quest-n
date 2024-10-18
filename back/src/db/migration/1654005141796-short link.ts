import {MigrationInterface, QueryRunner} from "typeorm";

export class shortLink1654005141796 implements MigrationInterface {
    name = 'shortLink1654005141796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "short_link" ("id" SERIAL NOT NULL, "shortLink" character varying NOT NULL, "source" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7908299b513d8842d9f473a2f49" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "short_link"`);
    }

}
