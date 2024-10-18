import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeTwitterTasksUnlimitedPoints1689685551021 implements MigrationInterface {
  name = 'removeTwitterTasksUnlimitedPoints1689685551021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE "task_progress"
        SET
	        "earnedPoints"="subquery"."earnedPoints",
	        "json"="subquery"."json"
        FROM
	        (
		        SELECT
			        tp."id" AS "id",
			        lt."points" AS "earnedPoints",
			        (tp."json" || jsonb_build_object(
			            'unlimitedEarnedPoints', 0
			        )) AS "json"
		        FROM "loyalty_project" AS lp
			        LEFT JOIN "loyalty_task" AS lt ON lt."loyaltyProjectId"=lp."id"
			        LEFT JOIN "task_progress" AS tp ON lt."id"=tp."loyaltyTaskId"
		        WHERE (lt."type"='mentionTwitter' OR lt."type"='reTweetQuoteTwitter')
			        AND lp."endAt">'2023-07-01' AND tp."earnedPoints">lt."points"
	        ) AS "subquery"
        WHERE "subquery"."id"="task_progress"."id"
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
