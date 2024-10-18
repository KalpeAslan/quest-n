export const GET_PARTICIPANTS = `
    SELECT
        COUNT(DISTINCT tp."investorId") as "participants"
    FROM task_progress as tp
    WHERE tp."loyaltyProjectId"=$1
`;

export const GET_PARTNER_PROJECT_PARTICIPANTS = `
    SELECT
	    COUNT(DISTINCT tp."investorId") AS participants
    FROM task_progress AS tp
	    LEFT JOIN loyalty_project AS lp ON tp."loyaltyProjectId"=lp."id"
	    LEFT JOIN loyalty_project_partner_projects_partner_project AS lppp ON lp."id"=lppp."loyaltyProjectId"
    WHERE lppp."partnerProjectId"=$1
`;

export const GET_PARTICIPATED_PROJECTS_COUNT = `
    SELECT
	    COUNT(DISTINCT tp."loyaltyProjectId") as "projectsCount"
    FROM task_progress as tp
    WHERE tp."investorId"=$1
`;

export const GET_EARNED_POINTS = `
    SELECT
        SUM(tp."earnedPoints") AS "totalPoints"
    FROM task_progress AS tp
    WHERE tp."loyaltyProjectId"=$1 AND tp."investorId"=$2
`;

export const GET_SCOREBOARD = `
    WITH "loyaltyProject" AS (
    	SELECT
    		lp."id" AS "id",
    		lp."projectType" AS "type",
    		lp."endAt" AS "endAt",
    		(COALESCE(lp."questStatus", $5) = $6) AS "completed",
    		lp."threshold" AS "threshold",
    		lp."eligibleUsersCount" AS "eligibleUsersCount"
    	FROM "loyalty_project" AS lp
    	WHERE lp."linkTitle"=$1
    ),
    "scoreboard" AS (
    	SELECT
			COUNT(tp."investorId") OVER() AS "total",
    		tp."investorId" AS "id",
    		(ROW_NUMBER() OVER(
    			ORDER BY SUM(tp."earnedPoints") DESC, MAX(tp."completedAt") ASC, MAX(tp."createdDate") ASC)
    		) AS "place",
    		COALESCE(i."username", ('default_'|| tp."investorId")) AS "wallet",
            SUM(tp."earnedPoints") AS "earnedPoints",
			(NOT ldp."id" IS NULL) AS "isWinner",
			COUNT(
				CASE
					WHEN (SUM(tp."earnedPoints")>=lp."threshold") THEN 1
				END
			) OVER() AS "eligibleUsersCount"
        FROM task_progress AS tp
            LEFT JOIN investor AS i ON i.id=tp."investorId"
            LEFT JOIN "loyaltyProject" AS lp ON TRUE
			LEFT JOIN "lucky_draw_progress" AS ldp ON lp."id"=ldp."loyaltyProjectId" AND ldp."investorId"=i."id"
        WHERE tp."loyaltyProjectId"=lp."id" AND tp."earnedPoints">0
        GROUP BY
    		tp."investorId",
    		i."username",
			ldp."id",
			lp."threshold"
        ORDER BY "earnedPoints" DESC, MAX(tp."completedAt") ASC, MAX(tp."createdDate") ASC
    ),
    "userInfo" AS (
    	SELECT
    		jsonb_build_object(
    			'wallet', s."wallet",
    			'earnedPoints', s."earnedPoints",
    			'place', s."place"
    		) AS "info"
    	FROM "scoreboard" AS s
    	WHERE s."id"=$2
    )
    SELECT
    	jsonb_build_object(
    		'total', s."total",
    		'scoreboard', (
				CASE
					WHEN (COUNT(s."id") = 0) THEN '[]'::jsonb
					ELSE jsonb_agg(
    						jsonb_build_object(
    							'id', s."id",
    							'place', s."place",
    							'wallet', s."wallet",
    							'earnedPoints', s."earnedPoints",
    							'status', (
    								CASE
    									WHEN (lp."type"=$3) THEN
    										(
    											CASE
    												WHEN ((NOT lp."endAt" IS NULL) AND (NOW() >= lp."endAt") AND lp."completed") THEN
    													(
    														CASE
    															WHEN (s."isWinner") THEN
    																'winner'
    															ELSE 'loser'
    														END
    													)
    												ELSE (
    													CASE
    														WHEN (s."earnedPoints" >= lp."threshold") THEN
    															'eligible'
    														ELSE 'notEligible'
    													END
    												)
    											END
    										)
    									WHEN (lp."type"=$4) THEN
    										(
    											CASE
    												WHEN (s."earnedPoints">=lp."threshold") THEN
    													'winner'
    												ELSE 'participant'
    											END
    					 					)
    									ELSE NULL
    								END
    							)
    						)
    					)
				END
			),
    		'luckyDrawWinnersCount', (
    			CASE
    				WHEN (lp."type"=$3) THEN
    					lp."eligibleUsersCount"
    				ELSE NULL
    			END
    		),
			'eligibleUsersCount', (
    			CASE
    				WHEN (lp."type"='luckyDraw') THEN
    					s."eligibleUsersCount"
    				ELSE NULL
    			END
    		),
    		'userInfo', ui."info"
    	) AS "result"
    FROM "scoreboard" AS s
    	LEFT JOIN "userInfo" AS ui ON TRUE
    	RIGHT JOIN "loyaltyProject" AS lp ON TRUE
    GROUP BY lp."eligibleUsersCount", lp."type", ui."info", s."total", s."eligibleUsersCount"
`;

export const GET_SCOREBOARD_PAGINATE = `
    WITH "loyaltyProject" AS (
    	SELECT
    		lp."id" AS "id",
    		lp."projectType" AS "type",
    		lp."endAt" AS "endAt",
    		(COALESCE(lp."questStatus", $7) = $8) AS "completed",
    		lp."threshold" AS "threshold",
    		lp."eligibleUsersCount" AS "eligibleUsersCount"
    	FROM "loyalty_project" AS lp
    	WHERE lp."linkTitle"=$1
    ),
    "scoreboard" AS (
    	SELECT
			COUNT(tp."investorId") OVER() AS "total",
    		tp."investorId" AS "id",
    		(ROW_NUMBER() OVER(
    			ORDER BY SUM(tp."earnedPoints") DESC, MAX(tp."completedAt") ASC, MAX(tp."createdDate") ASC)
    		) AS "place",
    		COALESCE(i."username", ('default_'|| tp."investorId")) AS "wallet",
            SUM(tp."earnedPoints") AS "earnedPoints",
			(NOT ldp."id" IS NULL) AS "isWinner",
			COUNT(
				CASE
					WHEN (SUM(tp."earnedPoints")>=lp."threshold") THEN 1
				END
			) OVER() AS "eligibleUsersCount"
        FROM task_progress AS tp
            LEFT JOIN investor AS i ON i.id=tp."investorId"
            LEFT JOIN "loyaltyProject" AS lp ON TRUE
			LEFT JOIN "lucky_draw_progress" AS ldp ON lp."id"=ldp."loyaltyProjectId" AND ldp."investorId"=i."id"
        WHERE tp."loyaltyProjectId"=lp."id" AND tp."earnedPoints">0
        GROUP BY
    		tp."investorId",
    		i."username",
			ldp."id",
			lp."threshold",
			lp."type"
        ORDER BY
			CASE WHEN lp."type"='luckyDraw' THEN (NOT ldp."id" IS NULL) END DESC,
			"earnedPoints" DESC,
			MAX(tp."completedAt") ASC,
			MAX(tp."createdDate") ASC
    	LIMIT $5 OFFSET $6
    ),
    "userInfo" AS (
    	SELECT
    		jsonb_build_object(
    			'wallet', s."wallet",
    			'earnedPoints', s."earnedPoints",
    			'place', s."place"
    		) AS "info"
    	FROM "scoreboard" AS s
    	WHERE s."id"=$2
    )
    SELECT
    	jsonb_build_object(
    		'total', s."total",
    		'scoreboard', (
				CASE
					WHEN (COUNT(s."id") = 0) THEN '[]'::jsonb
					ELSE jsonb_agg(
    						jsonb_build_object(
    							'id', s."id",
    							'place', s."place",
    							'wallet', s."wallet",
    							'earnedPoints', s."earnedPoints",
    							'status', (
    								CASE
    									WHEN (lp."type"=$3) THEN
    										(
    											CASE
    												WHEN ((NOT lp."endAt" IS NULL) AND (NOW() >= lp."endAt") AND lp."completed") THEN
    													(
    														CASE
    															WHEN (s."isWinner") THEN
    																'winner'
    															ELSE 'loser'
    														END
    													)
    												ELSE (
    													CASE
    														WHEN (s."earnedPoints" >= lp."threshold") THEN
    															'eligible'
    														ELSE 'notEligible'
    													END
    												)
    											END
    										)
    									WHEN (lp."type"=$4) THEN
    										(
    											CASE
    												WHEN (s."earnedPoints">=lp."threshold") THEN
    													'winner'
    												ELSE 'participant'
    											END
    					 					)
    									ELSE NULL
    								END
    							)
    						)
    					)
				END
			),
    		'luckyDrawWinnersCount', (
    			CASE
    				WHEN (lp."type"=$3) THEN
    					lp."eligibleUsersCount"
    				ELSE NULL
    			END
    		),
			'eligibleUsersCount', (
    			CASE
    				WHEN (lp."type"='luckyDraw') THEN
    					s."eligibleUsersCount"
    				ELSE NULL
    			END
    		),
    		'userInfo', ui."info"
    	) AS "result"
    FROM "scoreboard" AS s
    	LEFT JOIN "userInfo" AS ui ON TRUE
    	RIGHT JOIN "loyaltyProject" AS lp ON TRUE
    GROUP BY lp."eligibleUsersCount", lp."type", ui."info", s."total", s."eligibleUsersCount"
`;

export const GET_INVESTOR_SCOREBOARD_INFO = `
    SELECT
	    "place",
	    "earnedPoints"
    FROM (
        SELECT
		    tp."investorId" AS "investorId",
		    SUM(tp."earnedPoints") AS "earnedPoints",
            ROW_NUMBER() OVER (
			    ORDER BY SUM(tp."earnedPoints") DESC, MAX(tp."completedAt") ASC, MAX(tp."createdDate") ASC
		    ) AS "place"
        FROM task_progress AS tp
	    WHERE tp."loyaltyProjectId"=$1 AND tp."earnedPoints">0
	    GROUP BY tp."investorId"
    ) AS "subQuery"
    WHERE "subQuery"."investorId"=$2
`;

export const GET_MIN_PLACE_POINTS = `
    SELECT
	    MIN("earnedPoints") AS "minPoints"
    FROM (
        SELECT
		    SUM(tp."earnedPoints") AS "earnedPoints",
            ROW_NUMBER() OVER (
			    ORDER BY SUM(tp."earnedPoints") DESC, MAX(tp."completedAt") ASC, MAX(tp."createdDate") ASC
		    ) AS "place"
        FROM task_progress AS tp
	    WHERE tp."loyaltyProjectId"=$1 AND tp."earnedPoints" > 0
	    GROUP BY tp."investorId"
    ) AS "subQuery"
    WHERE "place" >= $2 AND "place" <= $3
`;

export const getCountAndGroupByProjectIdsQuery = (loyaltyProjectIds: number[], days: number) =>
  `
    SELECT
	    tp."loyaltyProjectId" AS "loyaltyProjectId",
	    COUNT(DISTINCT tp."investorId") as "count"
    FROM task_progress AS tp
    WHERE tp."loyaltyProjectId" IN (${loyaltyProjectIds.length ? loyaltyProjectIds : [0]})
	    AND "createdDate" > NOW() - interval '${days} DAYS'
    GROUP BY tp."loyaltyProjectId";
  `;

export const getRandomForLuckyDrawQuery = (excludedInvestorIds: number[]) => {
  const query = `
 WITH levels AS (
    SELECT
        tp."loyaltyProjectId",
        tp."investorId",
        (CASE
            WHEN el."bonusLuckyDrawPercentage" IS NULL THEN 0
            ELSE el."bonusLuckyDrawPercentage"
        END) AS "bonusLuckyDrawPercentage",
        SUM(tp."earnedPoints") AS "earnedPoints"
    FROM
        task_progress AS tp
           	LEFT JOIN (
            SELECT
                ep."investorId",
                SUM(ep."earnedPoints") AS "earnedPoints"
            FROM
                "experience_progress" AS ep
            GROUP BY
                ep."investorId"
        ) AS ep_sum ON tp."investorId" = ep_sum."investorId"
            LEFT JOIN "experience_level" AS el ON ep_sum."earnedPoints" BETWEEN el."pointsFrom" AND el."pointsTo"
    WHERE
            tp."loyaltyProjectId" = $1
  AND (tp."investorId" NOT IN (${excludedInvestorIds.length ? excludedInvestorIds : [0]}))
 GROUP BY
        tp."loyaltyProjectId", tp."investorId", el."bonusLuckyDrawPercentage"
),
     random_with_bonus AS (
         SELECT
             "investorId",
             "loyaltyProjectId",
             "earnedPoints",
             "bonusLuckyDrawPercentage",
             random() * (1.0 + "bonusLuckyDrawPercentage" / 100.0) AS "randomBonusAdjusted"
         FROM
             levels
     )
SELECT
   	"investorId",
    "loyaltyProjectId",
    "earnedPoints",
    "bonusLuckyDrawPercentage",
    "randomBonusAdjusted"
FROM
    random_with_bonus
GROUP BY
    "investorId", "loyaltyProjectId", "bonusLuckyDrawPercentage", "randomBonusAdjusted", "earnedPoints"
HAVING
        SUM("earnedPoints") >= $2
ORDER BY
    "randomBonusAdjusted" DESC
LIMIT $3`;
  console.log('LD winners query');

  return query;
};

export const GET_ELIGIBLE_USERS_COUNT = `
    SELECT
      	COUNT(DISTINCT "subQuery"."investorId") AS "count"
    FROM (
	    SELECT
		    tp."investorId" AS "investorId",
		    SUM(tp."earnedPoints") AS "earnedPoints"
	    FROM task_progress AS tp
	    WHERE tp."loyaltyProjectId" = $1
	    GROUP BY tp."investorId"
    ) AS "subQuery"
    WHERE "subQuery"."earnedPoints" >= $2
`;

export const GET_UNIQUE_INVESTORS_OF_LOYALTY_PROJECT = `
    SELECT DISTINCT "investorId"
    FROM "task_progress"
    WHERE "loyaltyProjectId" = $1
  `;

export const GET_LUCKY_DRAW_WINNERS = `
WITH SummedPoints AS (
    SELECT
        ep."investorId",
        SUM(ep."earnedPoints") AS TotalPoints
    FROM experience_progress ep
    GROUP BY ep."investorId"
)
SELECT
    ldp."investorId",
    COALESCE(el."image", first_level."image") AS Image,
    i.username
FROM lucky_draw_progress ldp
         LEFT JOIN SummedPoints sp ON sp."investorId" = ldp."investorId"
         LEFT JOIN experience_level el ON sp.TotalPoints BETWEEN el."pointsFrom" AND el."pointsTo"
         LEFT JOIN investor i on ldp."investorId" = i.id
         CROSS JOIN (
    SELECT "image"
    FROM experience_level
    ORDER BY "pointsFrom"
    LIMIT 1
) AS first_level
WHERE ldp."loyaltyProjectId" = $1;
`;

export const GET_TASKS_COUNT_COMPLETION = `
	WITH "completedTasks" AS (
		SELECT
			tp."investorId",
        	COUNT(tp.id) AS "completedCount"
		FROM task_progress AS tp
		WHERE tp."completedAt" IS NOT NULL AND tp."loyaltyProjectId" = $1
		GROUP BY tp."investorId"
	)
	SELECT
 		ct."completedCount" AS "tasksCount",
 		COUNT(ct."investorId") AS "completionCount"
	FROM "completedTasks" AS ct
	GROUP BY ct."completedCount"
	ORDER BY ct."completedCount"
`;

export const GET_TASKS_COMPLETION = `
	SELECT
		lt."id" AS "id",
		lt."title" AS "title",
		COUNT(tp."investorId") AS "completionCount"
	FROM task_progress AS tp
		LEFT JOIN loyalty_task AS lt ON tp."loyaltyTaskId" = lt."id"
	WHERE tp."loyaltyProjectId" = $1
	GROUP BY lt."id", lt."title"
	ORDER BY "completionCount"
`;

export const GET_TASKS_COMPLETION_BY_DATES = `
	SELECT
		lt."id" AS "id",
		lt."title" AS "title",
		COUNT(tp."investorId") FILTER (WHERE tp."createdDate" >= $2::timestamptz AND tp."createdDate" <= $3::timestamptz) AS "completionCount",
		COUNT(tp."investorId") AS "total"
	FROM task_progress AS tp
		LEFT JOIN loyalty_task AS lt ON tp."loyaltyTaskId" = lt."id"
	WHERE tp."loyaltyProjectId" = $1
	GROUP BY lt."id", lt."title"
`;
