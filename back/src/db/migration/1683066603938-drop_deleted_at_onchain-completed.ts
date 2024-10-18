import {MigrationInterface, QueryRunner} from "typeorm";

export class DropDeletedAtOnchainCompleted1683066603938 implements MigrationInterface {
    name = 'DropDeletedAtOnchainCompleted1683066603938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest_completed_on_chain_tasks" DROP COLUMN "deleted_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest_completed_on_chain_tasks" ADD "deleted_at" TIMESTAMP`);
    }

}
