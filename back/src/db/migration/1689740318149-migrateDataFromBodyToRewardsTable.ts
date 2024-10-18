import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrateDataFromBodyToRewardsTable1689740318149 implements MigrationInterface {
  name = 'migrateDataFromBodyToRewardsTable1689740318149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO "rewards" ("amount", "isClaimable", "description", "startPlace", "endPlace", "loyaltyProjectId", "tokenId")
    SELECT 
        (token->>'amount')::numeric AS "amount",
        true AS "isClaimable",
        CASE "loyalty_project"."projectType"
            WHEN 'scoreboard' THEN 'Scoreboard Reward'
            WHEN 'luckyDraw' THEN 'Lucky Draw Reward'
            WHEN 'guaranteed' THEN 'Guaranteed Reward'
            ELSE 'Unknown Reward Type'
        END AS "description",
        (reward->>'startPlace')::numeric AS "startPlace",
        (reward->>'endPlace')::numeric AS "endPlace",
        "loyalty_project"."id" AS "loyaltyProjectId",
        (token->'token'->>'id')::numeric AS "tokenId"
    FROM 
        "loyalty_project",
        jsonb_array_elements(
            CASE "loyalty_project"."projectType"
                WHEN 'scoreboard' THEN "loyalty_project"."body"->'scoreboardRewards'->'rewards'
                WHEN 'luckyDraw' THEN "loyalty_project"."body"->'luckyDrawRewards'->'rewards'
                WHEN 'guaranteed' THEN "loyalty_project"."body"->'guaranteedRewards'->'rewards'
                ELSE '[]'::jsonb
            END
        ) as reward,
        jsonb_array_elements(
            CASE "loyalty_project"."projectType"
                WHEN 'scoreboard' THEN reward->'tokens'
                WHEN 'luckyDraw' THEN reward->'tokens'
                WHEN 'guaranteed' THEN reward->'tokens'
                ELSE '[]'::jsonb
            END
        ) as token;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "rewards"
    WHERE "id" IN (
        SELECT r."id"
        FROM "rewards" r
        JOIN "loyalty_project" lp ON r."loyaltyProjectId" = lp."id"
        WHERE
            lp."projectType" IN ('scoreboard', 'luckyDraw', 'guaranteed')
    );`);
  }
}
