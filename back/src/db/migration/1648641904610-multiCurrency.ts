import {MigrationInterface, QueryRunner} from "typeorm";

export class multiCurrency1648641904610 implements MigrationInterface {
    name = 'multiCurrency1648641904610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "projectCurrencyAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "projectCurrencyIcon" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "projectCurrencyIcon"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "projectCurrencyAddress"`);
    }

}
