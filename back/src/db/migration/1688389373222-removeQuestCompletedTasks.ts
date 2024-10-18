import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeQuestCompletedTasks1688389373222 implements MigrationInterface {
  name = 'removeQuestCompletedTasks1688389373222';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE task_progress ALTER COLUMN json SET DEFAULT '{}'`);
    await queryRunner.query(
      `
      INSERT INTO "task_progress" (
        "earnedPoints",
        "loyaltyProjectId",
        "investorId", 
        "createdDate",  
        "completedAt", 
        "loyaltyTaskId"
        )
        SELECT
            lt."points",
            lt."loyaltyProjectId",
            qct."investorId",
            qct."completedAt",
            qct."completedAt",
            qct."loyaltyTaskId"
        FROM 
            "quest_completed_tasks" as qct 
            LEFT JOIN "loyalty_task" as lt
            ON qct."loyaltyTaskId" = lt."id"
        WHERE lt.type NOT IN (
            'suggestion',
            'email',
            'mentionTwitter',
            'reTweetQuoteTwitter',
            'token',
            'nft',
            'blockchainUser',
            'nativeHolder',
            'valueHolder'
            )
      `,
    );
    await queryRunner.query(`DROP TABLE "quest_completed_tasks"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE task_progress ALTER COLUMN json SET DEFAULT NULL`);

    await queryRunner.query(`
        CREATE TABLE "public"."quest_completed_tasks" (
            "id" integer DEFAULT nextval('quest_completed_tasks_id_seq') NOT NULL,
            "completedAt" timestamp NOT NULL,
            "questProgressId" integer NOT NULL,
            "loyaltyTaskId" integer NOT NULL,
            "investorId" integer,
            CONSTRAINT "PK_d25878780f12ba35ea729f728b1" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `);

    await queryRunner.query(`
        INSERT INTO "quest_completed_tasks" (
            "completedAt",
            "questProgressId",
            "loyaltyTaskId",
            "investorId"
            )
            SELECT
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
      `);
  }
}
