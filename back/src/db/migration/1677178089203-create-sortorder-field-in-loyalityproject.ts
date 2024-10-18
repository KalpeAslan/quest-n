import {MigrationInterface, QueryRunner} from "typeorm";

export class createSortorderFieldInLoyalityproject1677178089203 implements MigrationInterface {
    name = 'createSortorderFieldInLoyalityproject1677178089203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "sortOrder" numeric`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD CONSTRAINT "UQ_e21e2933d2e8d97f9abce507fb2" UNIQUE ("sortOrder")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP CONSTRAINT "UQ_e21e2933d2e8d97f9abce507fb2"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "sortOrder"`);
    }

}
