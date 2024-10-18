import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDb1645690944932 implements MigrationInterface {
    name = 'updateDb1645690944932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "projectDescription"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "projectDescription" jsonb NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "projectDescription"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "projectDescription" character varying NOT NULL`);
    }

}
