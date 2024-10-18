import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeletedAt1646648029126 implements MigrationInterface {
    name = 'addDeletedAt1646648029126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "visible" TO "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "deletedAt" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "deletedAt" TO "visible"`);
    }

}
