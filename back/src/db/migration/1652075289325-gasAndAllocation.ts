import {MigrationInterface, QueryRunner} from "typeorm";

export class gasAndAllocation1652075289325 implements MigrationInterface {
    name = 'gasAndAllocation1652075289325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" ADD "gasLimit" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "gasPrice" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "sale" ADD "hideAllocation" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "hideAllocation"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "gasPrice"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "gasLimit"`);
    }

}
