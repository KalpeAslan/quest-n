import {MigrationInterface, QueryRunner} from "typeorm";

export class changeProjectDescripton1647355715386 implements MigrationInterface {
    name = 'changeProjectDescripton1647355715386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "projectDescription"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "projectDescription" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "projectDescription"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "projectDescription" jsonb NOT NULL`);
    }

}
