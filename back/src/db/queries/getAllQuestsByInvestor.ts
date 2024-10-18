export const getScoreboardWinnersByQuestId = function (questId: number) {
  return `WITH RankedPoints AS (
    SELECT
      tp."loyaltyProjectId",
      tp."investorId",
      SUM(tp."earnedPoints") AS "earnedPoints",
      MAX(lr."endPlace") as "maxEndPlace",
      MIN(lr."startPlace") as "minStartPlace",
      ROW_NUMBER() OVER (
        PARTITION BY tp."loyaltyProjectId"
        ORDER BY SUM(tp."earnedPoints") DESC, MAX(tp."completedAt") ASC, MAX(tp."createdDate") ASC
      ) AS "place"
    FROM task_progress AS tp
    JOIN loyalty_reward lr ON tp."loyaltyProjectId" = lr."loyaltyProjectId"
    WHERE tp."earnedPoints" > 0 AND tp."loyaltyProjectId" = ${questId}
    GROUP BY tp."loyaltyProjectId", tp."investorId"
  )
  
  SELECT
    rp."loyaltyProjectId",
    rp."earnedPoints",
    rp."place",
    rp."minStartPlace",
    rp."maxEndPlace",
    jsonb_agg(lr) AS "rewards",
    jsonb_agg(ct) AS "ct",
    gu.email as "googleUserEmail",
    eu.email as "emailUserEmail",
    wu.address as "walletAddress",
    tu."twitterUsername" as "twitterUsername",
    du."discordUsername" as "discordUsername",
    pu.phone as "phone",
    tlu."telegramUsername" as "telegramUsername",
    investor.id as "investorId",
    investor.*,
    experience_level.image as "experienceLevelImage"
  FROM RankedPoints rp
  LEFT JOIN google_user gu ON gu."investorId" = rp."investorId"
  LEFT JOIN email_user eu ON eu."investorId" = rp."investorId"
  LEFT JOIN wallet_user wu ON wu."investorId" = rp."investorId"
  LEFT JOIN twitter_user tu ON tu."investorId" = rp."investorId"
  LEFT JOIN discord_token du ON du."investorId" = rp."investorId"
  LEFT JOIN phone_user pu ON pu."investorId" = rp."investorId"
  LEFT JOIN telegram_user tlu ON tlu."investorId" = rp."investorId"
  LEFT JOIN investor ON investor."id" = rp."investorId"
  LEFT JOIN experience_level ON experience_level."id" = investor."experienceLevelId"
  LEFT JOIN loyalty_reward lr ON rp."loyaltyProjectId" = lr."loyaltyProjectId"
  LEFT JOIN contract ct ON ct."id" = lr."contractId"
  WHERE rp."place" <= rp."maxEndPlace" AND rp."place" >= rp."minStartPlace"
  GROUP BY rp."place", rp."minStartPlace", rp."maxEndPlace", rp."loyaltyProjectId", rp."earnedPoints", gu.email, eu.email, wu.address, tu."twitterUsername", du."discordUsername", pu.phone, tlu."telegramUsername", investor.id, experience_level.image;`;
};

export const getLuckyDrawWinnersByQuestId = function (questId: number) {
  return `WITH RankedPoints AS (
    SELECT
        tp."loyaltyProjectId",
        tp."investorId",
        SUM(tp."earnedPoints") AS "earnedPoints",
        ROW_NUMBER() OVER (
            PARTITION BY tp."loyaltyProjectId"
            ORDER BY SUM(tp."earnedPoints") DESC, MAX(tp."completedAt") ASC, MAX(tp."createdDate") ASC
        ) AS "place"
    FROM task_progress AS tp
    WHERE tp."earnedPoints" > 0 AND tp."loyaltyProjectId" = ${questId}
    GROUP BY tp."loyaltyProjectId", tp."investorId"
)
SELECT
    rp."loyaltyProjectId",
    rp."earnedPoints",
    jsonb_agg(lr) AS "rewards",
    jsonb_agg(ct) AS "ct",
    gu.email as "googleUserEmail",
    eu.email as "emailUserEmail",
    wu.address as "walletAddress",
    tu."twitterUsername" as "twitterUsername",
    du."discordUsername" as "discordUsername",
    pu.phone as "phone",
    tlu."telegramUsername" as "telegramUsername",
    investor.id as "investorId",
    investor.*,
    experience_level.image as "experienceLevelImage"
FROM RankedPoints rp
LEFT JOIN google_user gu ON gu."investorId" = rp."investorId"
LEFT JOIN email_user eu ON eu."investorId" = rp."investorId"
LEFT JOIN wallet_user wu ON wu."investorId" = rp."investorId"
LEFT JOIN twitter_user tu ON tu."investorId" = rp."investorId"
LEFT JOIN discord_token du ON du."investorId" = rp."investorId"
LEFT JOIN phone_user pu ON pu."investorId" = rp."investorId"
LEFT JOIN telegram_user tlu ON tlu."investorId" = rp."investorId"
LEFT JOIN investor ON investor."id" = rp."investorId"
LEFT JOIN experience_level ON experience_level."id" = investor."experienceLevelId"
INNER JOIN lucky_draw_progress ON lucky_draw_progress."investorId" = investor."id" AND lucky_draw_progress."loyaltyProjectId" = rp."loyaltyProjectId"
LEFT JOIN loyalty_reward lr ON rp."loyaltyProjectId" = lr."loyaltyProjectId"
LEFT JOIN contract ct ON ct."id" = lr."contractId"
GROUP BY rp."loyaltyProjectId", rp."earnedPoints", gu.email, eu.email, wu.address, tu."twitterUsername", du."discordUsername", pu.phone, tlu."telegramUsername", investor.id, experience_level.image;`;
};

export const getParticipantsByQuestId = function (questId: number) {
  return `WITH RankedPoints AS (
    SELECT
      tp."loyaltyProjectId",
      tp."investorId",
      SUM(tp."earnedPoints") AS "earnedPoints",
      ROW_NUMBER() OVER (
        PARTITION BY tp."loyaltyProjectId"
        ORDER BY SUM(tp."earnedPoints") DESC, MAX(tp."completedAt") ASC, MAX(tp."createdDate") ASC
      ) AS "place"
    FROM task_progress AS tp
    WHERE tp."earnedPoints" > 0 AND tp."loyaltyProjectId" = ${questId}
    GROUP BY tp."loyaltyProjectId", tp."investorId"
  )
  
  SELECT
    rp."loyaltyProjectId",
    rp."earnedPoints",
    rp."place",
    gu.email as "googleUserEmail",
    eu.email as "emailUserEmail",
    wu.address as "walletAddress",
    tu."twitterUsername" as "twitterUsername",
    du."discordUsername" as "discordUsername",
    pu.phone as "phone",
    tlu."telegramUsername" as "telegramUsername",
    investor.id as "investorId",
    investor.*,
    experience_level.image as "experienceLevelImage"
  FROM RankedPoints rp
  LEFT JOIN google_user gu ON gu."investorId" = rp."investorId"
  LEFT JOIN email_user eu ON eu."investorId" = rp."investorId"
  LEFT JOIN wallet_user wu ON wu."investorId" = rp."investorId"
  LEFT JOIN twitter_user tu ON tu."investorId" = rp."investorId"
  LEFT JOIN discord_token du ON du."investorId" = rp."investorId"
  LEFT JOIN phone_user pu ON pu."investorId" = rp."investorId"
  LEFT JOIN telegram_user tlu ON tlu."investorId" = rp."investorId"
  LEFT JOIN investor ON investor."id" = rp."investorId"
  LEFT JOIN experience_level ON experience_level."id" = investor."experienceLevelId"`;
};

export const generateGetQuests = function (
  contractType,
  status,
  search: string,
  visible: boolean,
  questType: string,
): string {
  return `WITH result AS (
    WITH rlp AS (
      WITH cte AS (
        SELECT
          l."loyaltyProjectId",
          "place",
          "earnedPoints"
        FROM (
               SELECT
                 "loyaltyProjectId"
               FROM task_progress
               WHERE "earnedPoints" > 0
               GROUP BY "loyaltyProjectId"
             ) AS l
               RIGHT JOIN (
          SELECT
            tp."loyaltyProjectId",
            tp."investorId",
            SUM(tp."earnedPoints") AS "earnedPoints",
            ROW_NUMBER() OVER (
              PARTITION BY tp."loyaltyProjectId"
              ORDER BY SUM(tp."earnedPoints") DESC, MAX(tp."completedAt") ASC, MAX(tp."createdDate") ASC
              ) AS "place"
          FROM task_progress AS tp
          WHERE tp."earnedPoints" > 0
          GROUP BY tp."loyaltyProjectId", tp."investorId"
        ) AS "subQuery" ON l."loyaltyProjectId" = "subQuery"."loyaltyProjectId"
        WHERE "subQuery"."investorId" = $1
      )
      SELECT *
      FROM cte
             JOIN loyalty_project AS tablex
                  ON cte."loyaltyProjectId" = tablex."id"
    )
    SELECT
      rlp."loyaltyProjectId",
      rlp."place",
      rlp."earnedPoints",
      rlp."id",
      rlp."linkTitle",
      rlp."projectName",
      rlp."backgroundImage",
      rlp."previewImage",
      rlp."description",
      rlp."startAt",
      rlp."endAt",
      rlp."claimingStartAt",
      rlp."claimingEndAt",
      rlp."socialDescription",
      rlp."title",
      rlp."sortOrder",
      rlp."featured",
      rlp."preview_img",
      rlp."visible",
      rlp."projectType",
      rlp."threshold",
      rlp."eligibleUsersCount",
      ldp."id" as "isWinner",
      MIN(loyalty_reward."startPlace") as "startPlace",
      MAX(loyalty_reward."endPlace") as "endPlace",
      CASE
        WHEN rlp."startAt" <= NOW() AND rlp."endAt" >= NOW() THEN 'participating'
        WHEN ldp."id" IS NOT NULL THEN 'win'
        WHEN rlp."endAt" < NOW() THEN 'expired'
        END AS status
    FROM rlp AS rlp
           LEFT JOIN lucky_draw_progress AS ldp
                     ON rlp."loyaltyProjectId" = ldp."loyaltyProjectId" AND ldp."investorId" = $1
           JOIN loyalty_reward AS loyalty_reward
                ON rlp."loyaltyProjectId" = loyalty_reward."loyaltyProjectId"
    GROUP BY
      rlp."loyaltyProjectId",
      rlp."place",
      rlp."earnedPoints",
      rlp."id",
      rlp."linkTitle",
      rlp."projectName",
      rlp."backgroundImage",
      rlp."previewImage",
      rlp."description",
      rlp."startAt",
      rlp."endAt",
      rlp."claimingStartAt",
      rlp."claimingEndAt",
      rlp."socialDescription",
      rlp."title",
      rlp."sortOrder",
      rlp."featured",
      rlp."preview_img",
      rlp."visible",
      rlp."projectType",
      rlp."threshold",
      rlp."eligibleUsersCount",
      ldp."id"
  ), reward_data AS (
    SELECT * FROM result
  ),
               aggregated_rewards AS (
                 SELECT
                   lr."loyaltyProjectId",
                   SUM(CASE
                         WHEN rd."projectType" = 'scoreboard' THEN CEIL(lr."amount" * (lr."endPlace" - lr."startPlace" + 1))
                         WHEN rd."projectType" = 'luckyDraw' THEN CEIL(lr."amount" * rd."eligibleUsersCount")
                         ELSE lr."amount"
                     END) AS total_amount
                 FROM loyalty_reward lr
                        INNER JOIN reward_data rd ON rd."loyaltyProjectId" = lr."loyaltyProjectId"
                 GROUP BY lr."loyaltyProjectId"
               )
          SELECT
            DISTINCT ON (rd."loyaltyProjectId")
            rd."place",
            rd."earnedPoints",
            rd."id",
            rd."linkTitle",
            rd."projectName",
            rd."backgroundImage",
            rd."previewImage",
            rd."description",
            rd."startAt",
            rd."endAt",
            rd."claimingStartAt",
            rd."claimingEndAt",
            rd."socialDescription",
            rd."title",
            rd."sortOrder",
            rd."featured",
            rd."preview_img",
            rd."visible",
            rd."projectType",
            rd."threshold",
            rd."eligibleUsersCount",
            rd."isWinner",
            rd."startPlace",
            rd."endPlace",
            rd."status",
            partner_project."name" AS "projectName",
            partner_project."projectDescription",
            json_agg(
              json_build_object(
                'id', lr."id",
                'amount', COALESCE(ar.total_amount, lr."amount"),
                'isClaimable', lr."isClaimable",
                'description', lr."description",
                'startPlace', lr."startPlace",
                'endPlace', lr."endPlace",
                'loyaltyProjectId', lr."loyaltyProjectId",
                'contractId', lr."contractId",
                'verified', lr."verified",
                'tokenIds', lr."tokenIds",
                'investorId', lr."investorId",
                'contract', (
                  SELECT
                    json_build_object(
                      'id', c."id",
                      'name', c."name",
                      'symbol', c."symbol",
                      'logo', c."logo",
                      'investorId', c."investorId",
                      'type', c."type",
                      'chainId', c."chainId",
                      'address', c."address",
                      'standard', c."standard",
                      'isVerified', c."isVerified",
                      'decimals', c."decimals"
                      )
                  FROM contract c
                  WHERE c."id" = lr."contractId"
                )
                )
              ) AS rewards
          FROM reward_data rd
                 LEFT JOIN loyalty_reward lr ON rd."loyaltyProjectId" = lr."loyaltyProjectId"
                 LEFT JOIN contract ON lr."contractId" = contract."id"
                 LEFT JOIN aggregated_rewards ar ON rd."loyaltyProjectId" = ar."loyaltyProjectId"
                 LEFT JOIN loyalty_project_partner_projects_partner_project lpp ON rd."loyaltyProjectId" = lpp."loyaltyProjectId"
                 LEFT JOIN partner_project ON lpp."partnerProjectId" = partner_project."id"

          WHERE contract."type" IN (${contractType})
            AND rd."status" IN (${status})
            AND (LOWER(rd."title") LIKE '%${search}%')
            AND rd."visible" = ${visible}
            AND rd."projectType" IN (${questType})
          GROUP BY
            rd."loyaltyProjectId",
            rd."place",
            rd."earnedPoints",
            rd."id",
            rd."linkTitle",
            rd."projectName",
            rd."backgroundImage",
            rd."previewImage",
            rd."description",
            rd."startAt",
            rd."endAt",
            rd."claimingStartAt",
            rd."claimingEndAt",
            rd."socialDescription",
            rd."title",
            rd."sortOrder",
            rd."featured",
            rd."preview_img",
            rd."visible",
            rd."projectType",
            rd."threshold",
            rd."eligibleUsersCount",
            rd."isWinner",
            rd."startPlace",
            rd."endPlace",
            rd."status",
            partner_project."name",
            partner_project."projectDescription";
  `;
};
