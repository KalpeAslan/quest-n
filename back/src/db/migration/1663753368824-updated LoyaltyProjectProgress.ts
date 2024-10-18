import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedLoyaltyProjectProgress1663753368824 implements MigrationInterface {
    name = 'updatedLoyaltyProjectProgress1663753368824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress" ADD "completedLoyaltyTasks" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress" ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress" DROP COLUMN "updatedDate"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress" DROP COLUMN "completedLoyaltyTasks"`);
    }

}
