import {MigrationInterface, QueryRunner} from "typeorm";

export class tokenPrice1648132561375 implements MigrationInterface {
    name = 'tokenPrice1648132561375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "pricePerToken" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "pricePerToken"`);
    }

}
