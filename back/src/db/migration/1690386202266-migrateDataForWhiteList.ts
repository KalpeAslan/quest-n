/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrateDataForWhiteList1690386202266 implements MigrationInterface {
  name = 'migrateDataForWhiteList1690386202266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tokens = await queryRunner.query(`SELECT * FROM "token" where name = 'WL' and type = 'whitelist'`);
    const whitelistToken = tokens[0];
    await queryRunner.query(`
        INSERT INTO "loyalty_reward" ("amount", "isClaimable", "description", "startPlace", "endPlace", "loyaltyProjectId", "tokenId")
        SELECT
        1 as "amount",
        true AS "isClaimable",
        'whitelist' AS "description",
        (reward->>'startPlace')::numeric AS "startPlace",
        (reward->>'endPlace')::numeric AS "endPlace",
        (lp."id") AS "loyaltyProjectId",
        ${whitelistToken.id} AS "tokenId"
    FROM
        "loyalty_project" lp,
        jsonb_array_elements(lp."body"->'luckyDrawRewards'->'rewards') WITH ORDINALITY AS reward(reward, i)
    WHERE
        lp."projectType" = 'luckyDraw'
        AND reward->>'whitelisting' = 'true';
    `);

    await queryRunner.query(`
    INSERT INTO "loyalty_reward" ("amount", "isClaimable", "description", "startPlace", "endPlace", "loyaltyProjectId", "tokenId")
    SELECT
    1 as "amount",
    true AS "isClaimable",
    'whitelist' AS "description",
    (reward->>'startPlace')::numeric AS "startPlace",
    (reward->>'endPlace')::numeric AS "endPlace",
    (lp."id") AS "loyaltyProjectId",
    ${whitelistToken.id} AS "tokenId"
FROM
    "loyalty_project" lp,
    jsonb_array_elements(lp."body"->'scoreboardRewards'->'rewards') WITH ORDINALITY AS reward(reward, i)
WHERE
    lp."projectType" = 'scoreboard'
    AND reward->>'whitelisting' = 'true';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
