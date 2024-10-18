import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeQuestCompletedOnChainTasks1688373906064 implements MigrationInterface {
  name = 'removeQuestCompletedOnChainTasks1688373906064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      INSERT INTO "task_progress" (
        "earnedPoints",
        "loyaltyProjectId",
        "investorId", 
        "createdDate",  
        "completedAt", 
        "loyaltyTaskId",
        "json"
        )
        SELECT
            lt."points",
            lt."loyaltyProjectId",
            qco."investorId",
            qco."completedAt",
            qco."completedAt",
            qco."loyaltyTaskId",
            jsonb_build_object('wallet',qco.wallet,'amount',qco.amount)
        FROM 
            "quest_completed_on_chain_tasks" as qco 
            LEFT JOIN "loyalty_task" as lt
            ON qco."loyaltyTaskId" = lt."id"
      `,
    );
    await queryRunner.query(`DROP TABLE "quest_completed_on_chain_tasks"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "quest_completed_on_chain_tasks" (
            "id" integer DEFAULT nextval('quest_completed_on_chain_tasks_id_seq') NOT NULL,
            "wallet" character varying NOT NULL,
            "amount" numeric DEFAULT '0' NOT NULL,
            "completedAt" timestamp NOT NULL,
            "questProgressId" integer NOT NULL,
            "loyaltyTaskId" integer NOT NULL,
            "investorId" integer NOT NULL,
            CONSTRAINT "PK_d6ee5bae8433c39c01dde4578dc" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `);

    await queryRunner.query(`
        INSERT INTO "quest_completed_on_chain_tasks" (
            "wallet",
            "amount",
            "completedAt",
            "questProgressId",
            "loyaltyTaskId",
            "investorId"
            )
            SELECT 
                "json"->>'wallet' AS "wallet",
                "json"->>'amount' AS "amount",
                tp."completedAt" AS "completedAt",
                qp."id" AS "questProgressId",
                tp."loyaltyTaskId",
                tp."investorId"
            FROM
                "task_progress" AS tp
                LEFT JOIN "loyalty_task" AS lt
                    ON tp."loyaltyTaskId" = lt."id"
                LEFT JOIN "quest_progress" AS qp
                    ON (lt."loyaltyProjectId" = qp."loyaltyProjectId" AND tp."investorId" = qp."investorId")
            WHERE lt."type" = 'token' 
                OR lt."type" = 'nft'
                OR lt."type" = 'blockchainUser'
                OR lt."type" = 'valueHolder'
                OR lt."type" = 'nativeHolder'
      `);
  }
}
