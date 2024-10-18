import { MigrationInterface, QueryRunner } from 'typeorm';

export class moveDataFromMintokenAmountIntoRewards1689839263068 implements MigrationInterface {
  name = 'moveDataFromMintokenAmountIntoRewards1689839263068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "token" ("name", "symbol") VALUES ('AG', 'AG');`);
    const tokens = await queryRunner.query(`SELECT * FROM "token" where name = 'AG'`);
    const agToken = tokens[0];
    await queryRunner.query(`
        INSERT INTO "rewards" ("amount", "isClaimable", "description", "startPlace", "endPlace", "loyaltyProjectId", "tokenId")
        SELECT 
            CAST(
            CASE 
                WHEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric > 0 THEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric
                ELSE 0
            END * 0.02
        AS numeric) AS "amount",
            true AS "isClaimable",
            '1-5 places' AS "description",
            1 AS "startPlace",
            5 AS "endPlace",
            lp.id as "loyaltyProjectId",
            ${agToken.id} AS "tokenId"
        FROM 
            "loyalty_project" lp
        WHERE 
            lp."projectType" IN ('scoreboard');

        INSERT INTO "rewards" ("amount", "isClaimable", "description", "startPlace", "endPlace", "loyaltyProjectId", "tokenId")
        SELECT 
            CAST(
            CASE 
                WHEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric > 0 THEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric
                ELSE 0
            END * 0.016
        AS numeric) AS "amount",
            true AS "isClaimable",
            '6-10 places' AS "description",
            6 AS "startPlace",
            10 AS "endPlace",
            lp.id as "loyaltyProjectId",
            ${agToken.id} AS "tokenId"
        FROM 
            "loyalty_project" lp
        WHERE 
            lp."projectType" IN ('scoreboard');

        INSERT INTO "rewards" ("amount", "isClaimable", "description", "startPlace", "endPlace", "loyaltyProjectId", "tokenId")
        SELECT 
            CAST(
            CASE 
                WHEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric > 0 THEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric
                ELSE 0
            END * 0.01
        AS numeric) AS "amount",
            true AS "isClaimable",
            '11-15 places' AS "description",
            11 AS "startPlace",
            15 AS "endPlace",
            lp.id as "loyaltyProjectId",
            ${agToken.id} AS "tokenId"
        FROM 
            "loyalty_project" lp
        WHERE 
            lp."projectType" IN ('scoreboard');

        INSERT INTO "rewards" ("amount", "isClaimable", "description", "startPlace", "endPlace", "loyaltyProjectId", "tokenId")
        SELECT 
            CAST(
            CASE 
                WHEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric > 0 THEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric
                ELSE 0
            END * 0.00714285714
        AS numeric) AS "amount",
            true AS "isClaimable",
            '16-50 places' AS "description",
            16 AS "startPlace",
            50 AS "endPlace",
            lp.id as "loyaltyProjectId",
            ${agToken.id} AS "tokenId"
        FROM 
            "loyalty_project" lp
        WHERE 
            lp."projectType" IN ('scoreboard');

        INSERT INTO "rewards" ("amount", "isClaimable", "description", "startPlace", "endPlace", "loyaltyProjectId", "tokenId")
        SELECT 
            CAST(
            CASE 
                WHEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric > 0 THEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric
                ELSE 0
            END * 0.004
        AS numeric) AS "amount",
            true AS "isClaimable",
            '51-100 places' AS "description",
            51 AS "startPlace",
            100 AS "endPlace",
            lp.id as "loyaltyProjectId",
            ${agToken.id} AS "tokenId"
        FROM 
            "loyalty_project" lp
        WHERE 
            lp."projectType" IN ('scoreboard');

        INSERT INTO "rewards" ("amount", "isClaimable", "description", "startPlace", "endPlace", "loyaltyProjectId", "tokenId")
        SELECT 
            CAST(
            CASE 
                WHEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric > 0 THEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric
                ELSE 0
            END * 0.00133333333
        AS numeric) AS "amount",
            true AS "isClaimable",
            '101-250 places' AS "description",
            101 AS "startPlace",
            250 AS "endPlace",
            lp.id as "loyaltyProjectId",
            ${agToken.id} AS "tokenId"
        FROM 
            "loyalty_project" lp
        WHERE 
            lp."projectType" IN ('scoreboard');

        INSERT INTO "rewards" ("amount", "isClaimable", "description", "startPlace", "endPlace", "loyaltyProjectId", "tokenId")
        SELECT 
            CAST(
            CASE 
                WHEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric > 0 THEN (lp."body"->'scoreboardRewards'->>'minTokenAmount')::numeric
                ELSE 0
            END * 0.00048
        AS numeric) AS "amount",
            true AS "isClaimable",
            '251-500 places' AS "description",
            251 AS "startPlace",
            500 AS "endPlace",
            lp.id as "loyaltyProjectId",
            ${agToken.id} AS "tokenId"
        FROM 
            "loyalty_project" lp
        WHERE 
            lp."projectType" IN ('scoreboard');
    `);

    await queryRunner.query(`
    INSERT INTO "rewards" ("amount", "isClaimable", "description", "startPlace", "endPlace", "loyaltyProjectId", "tokenId")
    SELECT 
        CAST(
        CASE 
            WHEN (lp."body"->'luckyDrawRewards'->>'minTokenAmount')::numeric > 0 THEN (lp."body"->'luckyDrawRewards'->>'minTokenAmount')::numeric
            WHEN (lp."body"->'guaranteedRewards'->>'minTokenAmount')::numeric > 0 THEN (lp."body"->'guaranteedRewards'->>'minTokenAmount')::numeric
            ELSE 0
        END
    AS numeric) AS "amount",
        true AS "isClaimable",
        'description' AS "description",
        0 AS "startPlace",
        0 AS "endPlace",
        lp.id as "loyaltyProjectId",
        ${agToken.id} AS "tokenId"
    FROM 
        "loyalty_project" lp
    WHERE 
        lp."projectType" IN ('guaranteed', 'luckyDraw');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const agToken = await queryRunner.query(`SELECT FROM "token" where name = 'AG'`);
    await queryRunner.query(`DELETE FROM "rewards" where "tokenId" = ${agToken.id}`);
    await queryRunner.query(`DELETE FROM "token" where name = 'AG'`);
  }
}
