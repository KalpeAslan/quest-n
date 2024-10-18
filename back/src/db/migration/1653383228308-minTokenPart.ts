import {MigrationInterface, QueryRunner} from "typeorm";

export class minTokenPart1653383228308 implements MigrationInterface {
    name = 'minTokenPart1653383228308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" ADD "minTokenPart" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "minTokenPart"`);
    }

}
