import {MigrationInterface, QueryRunner} from "typeorm";

export class claiming1648067392873 implements MigrationInterface {
    name = 'claiming1648067392873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "vesting"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "vesting" jsonb NOT NULL DEFAULT '[100,0]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "vesting"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "vesting" character varying NOT NULL`);
    }

}
