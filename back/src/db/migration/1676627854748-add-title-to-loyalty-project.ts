import {MigrationInterface, QueryRunner} from "typeorm";

export class addTitleToLoyaltyProject1676627854748 implements MigrationInterface {
    name = 'addTitleToLoyaltyProject1676627854748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "title" character varying`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD CONSTRAINT "UQ_d72969fb34cb3ee75b26053c3eb" UNIQUE ("title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP CONSTRAINT "UQ_d72969fb34cb3ee75b26053c3eb"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "title"`);
    }

}
