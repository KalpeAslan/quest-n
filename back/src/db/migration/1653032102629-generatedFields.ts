import {MigrationInterface, QueryRunner} from "typeorm";

export class generatedFields1653032102629 implements MigrationInterface {
    name = 'generatedFields1653032102629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" ADD "generatedTokenDecimals" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "generatedStableDecimals" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "exchangeRate" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "exchangeRate"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "generatedStableDecimals"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "generatedTokenDecimals"`);
    }

}
