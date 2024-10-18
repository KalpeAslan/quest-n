import {MigrationInterface, QueryRunner} from "typeorm";

export class changeType1647347499570 implements MigrationInterface {
    name = 'changeType1647347499570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "participateButton"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "participateButton" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "participateButton"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "participateButton" boolean NOT NULL DEFAULT false`);
    }

}
