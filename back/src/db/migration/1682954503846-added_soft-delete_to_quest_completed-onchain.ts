import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedSoftDeleteToQuestCompletedOnchain1682954503846 implements MigrationInterface {
    name = 'AddedSoftDeleteToQuestCompletedOnchain1682954503846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE quest_completed_on_chain_tasks ADD COLUMN deleted_at TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest_completed_on_chain_tasks" DROP COLUMN "deleted_at"`);
    }

}
