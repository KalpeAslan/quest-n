import {MigrationInterface, QueryRunner} from "typeorm";

export class addTokenHolder1648224105861 implements MigrationInterface {
    name = 'addTokenHolder1648224105861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "tokenHolder" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "tokenHolder"`);
    }

}
