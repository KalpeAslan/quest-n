import {MigrationInterface, QueryRunner} from "typeorm";

export class QuestOnChainTasks1682600090169 implements MigrationInterface {
    name = 'QuestOnChainTasks1682600090169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quest_completed_on_chain_tasks" ("id" SERIAL NOT NULL, "wallet" character varying NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "completedAt" TIMESTAMP NOT NULL, "unlimitedEarnedPoints" numeric, "questProgressId" integer NOT NULL, "loyaltyTaskId" integer NOT NULL, "investorId" integer NOT NULL, CONSTRAINT "PK_d6ee5bae8433c39c01dde4578dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quest_completed_on_chain_tasks" ADD CONSTRAINT "FK_6d2a0de0a94b0e33295cd0b0d88" FOREIGN KEY ("questProgressId") REFERENCES "quest_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_completed_on_chain_tasks" ADD CONSTRAINT "FK_8cd9f32289384be503e93ae775f" FOREIGN KEY ("loyaltyTaskId") REFERENCES "loyalty_task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_completed_on_chain_tasks" ADD CONSTRAINT "FK_7bdaef3a949d378ced83e4b61a7" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest_completed_on_chain_tasks" DROP CONSTRAINT "FK_7bdaef3a949d378ced83e4b61a7"`);
        await queryRunner.query(`ALTER TABLE "quest_completed_on_chain_tasks" DROP CONSTRAINT "FK_8cd9f32289384be503e93ae775f"`);
        await queryRunner.query(`ALTER TABLE "quest_completed_on_chain_tasks" DROP CONSTRAINT "FK_6d2a0de0a94b0e33295cd0b0d88"`);
        await queryRunner.query(`DROP TABLE "quest_completed_on_chain_tasks"`);
    }

}
