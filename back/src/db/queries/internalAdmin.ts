export const getQuestParticipantsByLinkTitle = `WITH RankedPoints AS (
    SELECT
      tp."loyaltyProjectId",
      tp."investorId",
      SUM(tp."earnedPoints") AS "earnedPoints",
      investor."username",
      ROW_NUMBER() OVER (
        PARTITION BY tp."loyaltyProjectId"
        ORDER BY SUM(tp."earnedPoints") DESC, MAX(tp."completedAt") ASC, MAX(tp."createdDate") ASC
      ) AS "place",
      jsonb_agg(
        jsonb_build_object(
          'json', tp.json,
          'title', lt.title -- Add this line to include loyalty_task.title
        )
      ) FILTER (WHERE lt."type" = 'suggestion') AS "suggestion_tasks",
      jsonb_agg(
        jsonb_build_object(
          'json', tp.json,
          'title', lt.title -- Add this line to include loyalty_task.title
        )
      ) FILTER (WHERE lt."type" = 'imageUpload') AS "image_tasks",
      jsonb_agg(
        jsonb_build_object(
          'json', tp.json,
          'title', lt.title -- Add this line to include loyalty_task.title
        )
      ) FILTER (WHERE lt."type" = 'email') AS "email_tasks",
      tu."twitterUsername",
      du."discordUsername",
      tgu."telegramUsername",
      wu."address"
    FROM task_progress AS tp
    LEFT JOIN loyalty_task lt ON lt."id" = tp."loyaltyTaskId"
    LEFT JOIN twitter_user tu ON tu."investorId" = tp."investorId"
    LEFT JOIN telegram_user tgu on tgu."investorId" = tp."investorId"
    LEFT JOIN discord_user du ON du."investorId" = tp."investorId"
    LEFT JOIN wallet_user wu ON wu."investorId" = tp."investorId"
    LEFT JOIN investor ON investor."id" = tp."investorId"
    WHERE tp."earnedPoints" > 0 AND tp."loyaltyProjectId" = $1
    GROUP BY tp."loyaltyProjectId", tp."investorId", tu."twitterUsername", du."discordUsername", tgu."telegramUsername", wu."address", investor."username"
  )

  SELECT
    rp."loyaltyProjectId",
    rp."investorId",
    "earnedPoints",
    "place" as "scoreboardPlace",
    "twitterUsername" as "twitter",
    "discordUsername" as "discord",
    "telegramUsername" as "telegram",
    "address",
    "username",
    COALESCE("suggestion_tasks", '[]'::jsonb) AS "suggestionTasks",
    COALESCE("image_tasks", '[]'::jsonb) AS "imageTasks",
    COALESCE("email_tasks", '[]'::jsonb) AS "emailTasks",
    CASE
      WHEN lucky_draw_progress."loyaltyProjectId" IS NOT NULL THEN 'winner'
      WHEN lucky_draw_progress."loyaltyProjectId" IS NULL AND rp."earnedPoints" >= threshold THEN 'looser'
      ELSE 'notEligible'
    END AS "status"
  FROM RankedPoints rp
  LEFT JOIN loyalty_project ON loyalty_project."id" = rp."loyaltyProjectId"
  LEFT JOIN lucky_draw_progress ON lucky_draw_progress."loyaltyProjectId" = rp."loyaltyProjectId" AND lucky_draw_progress."investorId" = rp."investorId";`;
