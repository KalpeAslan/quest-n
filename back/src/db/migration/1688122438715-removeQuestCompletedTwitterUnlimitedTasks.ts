import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeQuestCompletedTwitterUnlimitedTasks1688122438715 implements MigrationInterface {
  name = 'removeQuestCompletedTwitterUnlimitedTasks1688122438715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "checked_twitter_users_stats_history"`);
    await queryRunner.query(`DROP TABLE "checked_twitter_users"`);

    await queryRunner.query(`
        UPDATE quest_completed_twitter_unlimited_tasks SET 
	        "unlimitedEarnedPoints"=0,
	        "unlimitedLikesCount"=0,
	        "unlimitedReTweetsCount"=0
        WHERE "unlimitedEarnedPoints" IS NULL
      `);

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
            lt."points" + qct."unlimitedEarnedPoints",
            lt."loyaltyProjectId",
            qct."investorId",
            qct."completedAt",
            qct."completedAt",
            qct."loyaltyTaskId",
            jsonb_build_object('tweetId',qct."tweetId",'unlimitedEarnedPoints',qct."unlimitedEarnedPoints",'unlimitedLikesCount',qct."unlimitedLikesCount",'unlimitedReTweetsCount',qct."unlimitedReTweetsCount",'unlimitedEndAt',qct."unlimitedEndAt")
        FROM 
            "quest_completed_twitter_unlimited_tasks" as qct 
            LEFT JOIN "loyalty_task" as lt
            ON qct."loyaltyTaskId" = lt."id"
      `,
    );
    await queryRunner.query(`DROP TABLE "quest_completed_twitter_unlimited_tasks"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "quest_completed_twitter_unlimited_tasks" (
            "id" integer DEFAULT nextval('quest_completed_twitter_unlimited_tasks_id_seq') NOT NULL,
            "tweetId" character varying NOT NULL,
            "completedAt" timestamp NOT NULL,
            "unlimitedEarnedPoints" numeric,
            "unlimitedLikesCount" numeric,
            "unlimitedReTweetsCount" numeric,
            "unlimitedEndAt" timestamp,
            "questProgressId" integer NOT NULL,
            "loyaltyTaskId" integer NOT NULL,
            "investorId" integer NOT NULL,
            CONSTRAINT "PK_42f7b47b411b5f5ab3a8214a1fc" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `);

    await queryRunner.query(`
        INSERT INTO "quest_completed_twitter_unlimited_tasks" (
            "tweetId",
            "completedAt",
            "unlimitedEarnedPoints",
            "unlimitedLikesCount",
            "unlimitedReTweetsCount",
            "unlimitedEndAt",
            "questProgressId",
            "loyaltyTaskId",
            "investorId"
            )
            SELECT 
                "json"->>'tweetId' AS "tweetId",
                tp."completedAt" AS "completedAt",
                "json"->>'unlimitedEarnedPoints' AS "unlimitedEarnedPoints",
                "json"->>'unlimitedLikesCount' AS "unlimitedLikesCount",
                "json"->>'unlimitedReTweetsCount' AS "unlimitedReTweetsCount",
                "json"->>'unlimitedEndAt' AS "unlimitedEndAt",
                qp."id" AS "questProgressId",
                tp."loyaltyTaskId",
                tp."investorId",
            FROM
                "task_progress" AS tp
                LEFT JOIN "loyalty_task" AS lt
                    ON tp."loyaltyTaskId" = lt."id"
                LEFT JOIN "quest_progress" AS qp
                    ON (lt."loyaltyProjectId" = qp."loyaltyProjectId" AND tp."investorId" = qp."investorId")
            WHERE lt."type" = 'mentionTwitter' OR lt."type" = 'reTweetQuoteTwitter'
      `);

    await queryRunner.query(`
        CREATE TABLE "public"."checked_twitter_users" (
            "id" integer DEFAULT nextval('checked_twitter_users_id_seq') NOT NULL,
            "twitterId" character varying NOT NULL,
            "score" numeric,
            "createdAt" timestamp DEFAULT now() NOT NULL,
            CONSTRAINT "PK_3253501eada297d819723edd0e4" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_2977ceb68f8ac143081af11cb06" UNIQUE ("twitterId")
        ) WITH (oids = false);
    `);

    await queryRunner.query(`
        CREATE TABLE "public"."checked_twitter_users_stats_history" (
            "id" integer DEFAULT nextval('checked_twitter_users_stats_history_id_seq') NOT NULL,
            "type" checked_twitter_users_stats_history_type_enum NOT NULL,
            "points" numeric NOT NULL,
            "createdAt" timestamp DEFAULT now() NOT NULL,
            "checkedTwitterUsersId" integer NOT NULL,
            "questCompletedTwitterUnlimitedTasksId" integer NOT NULL,
            CONSTRAINT "PK_05f4082186b5c30093e9b944ae1" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `);
  }
}
