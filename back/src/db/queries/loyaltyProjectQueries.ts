export const COMPILE_REWARDS = `
	WITH "resultTokens" AS (
		SELECT
			lr."loyaltyProjectId" AS "loyaltyProjectId",
			t."symbol" AS "symbol",
			t."logo" AS "logo",
			t."type" AS "type",
			(CASE
	 			WHEN lp."projectType"=$7 THEN CEIL(SUM(lr."amount" * (lr."endPlace" - lr."startPlace" + 1)))
				WHEN lp."projectType"=$8 THEN CEIL(SUM(lr."amount" * lp."eligibleUsersCount"))
	   	 		ELSE CEIL(SUM(lr."amount"))
			 END) AS "amount"
		FROM "loyalty_reward" AS lr
			LEFT JOIN "contract" AS t ON lr."contractId"=t."id"
			LEFT JOIN "loyalty_project" AS lp ON lr."loyaltyProjectId"=lp."id"
		WHERE lr."verified"=TRUE
		GROUP BY
			lr."loyaltyProjectId",
			lr."contractId",
			t."symbol",
			t."logo",
			t."type",
			lp."projectType"
	),
	"resultRewards" AS (
		SELECT
	    	"resultTokens"."loyaltyProjectId" AS "loyaltyProjectId",
	    	jsonb_agg(
	   			jsonb_build_object(
	   				'symbol', "resultTokens"."symbol",
	   				'logo', "resultTokens"."logo",
	   				'amount', "resultTokens"."amount",
					'type', "resultTokens"."type"
	   			)
	   		) AS "rewards"
	   	FROM "resultTokens"
	   	WHERE "resultTokens"."amount">0
	   	GROUP BY "resultTokens"."loyaltyProjectId"
	)
`;

export const GET_LOYALTY_PROJECTS = `
	,"tasksDone" AS (
		SELECT
			lp."id" AS "loyaltyProjectId",
			COUNT(1) AS "count"
		FROM "loyalty_project" AS lp
			LEFT JOIN "task_progress" AS tp ON tp."loyaltyProjectId" = lp."id"
		WHERE tp."investorId" = $5
		GROUP BY lp."id"
	),
	"scoreboardExp" AS (
		SELECT
			SUM(et."points") AS "points"
		FROM "experience_task" AS et
		WHERE et."type" = 'winScoreboardQuest'
	),
	"luckyDrawExp" AS (
		SELECT
			SUM(et."points") AS "points"
		FROM "experience_task" AS et
		WHERE et."type" = 'winLuckyDrawQuest'
	),
	"guaranteedExp" AS (
		SELECT
			SUM(et."points") AS "points"
		FROM "experience_task" AS et
		WHERE et."type" = 'winGuaranteedQuest'
	),
	"commonQuestExp" AS (
		SELECT
			SUM(et."points") AS "points"
		FROM "experience_task" AS et
		WHERE et."type" IN ('completeFirstTask', 'completeAllTasks')
	),
	"totalTasks" AS (
		SELECT
			lp."id" AS "loyaltyProjectId",
			COUNT(1) AS "count",
			SUM(COALESCE(et."points", 0)) AS "expPoints"
		FROM "loyalty_project" AS lp
			LEFT JOIN "loyalty_task" AS lt ON lt."loyaltyProjectId" = lp."id"
			LEFT JOIN "experience_task" AS et ON lt."experienceTaskId" = et."id"
		GROUP BY lp."id"
	),
    "resultLoyaltyProject" AS (
    	SELECT
			lp."questStatus" AS "questStatus",
    		lp."id" AS "id",
    		jsonb_agg(
    			json_build_object(
    				'logo', pp."logo",
    				'verificationIcon', pp."verificationIcon",
    				'name', pp."name",
    				'linkTitle', pp."linkTitle"
    			)
    		) AS "partnerProjects",
    		(
    		 CASE
    	    	WHEN lp."startAt" IS NULL OR lp."startAt" > NOW() THEN $1
    		    WHEN lp."endAt" <= NOW() THEN $2
				WHEN COALESCE(td."count", 0) = 0 THEN $4
    		    WHEN COALESCE(td."count", 0) > 0 THEN $3
    	    	ELSE $4
    		  END
    		) AS "status",
			jsonb_build_object(
				'tasksDone', COALESCE(td."count", 0),
				'totalTasks', COALESCE(tt."count", 0)
			) AS "tasksCount",
    		lp."startAt" AS "startAt",
    		lp."endAt" AS "endAt",
    		COALESCE(lp."title", lp."projectName") AS "title",
    		(
				jsonb_build_object(
    				'tokens', COALESCE(rr."rewards", '[]'::jsonb)
    			)
    		) AS "rewards",
    		lp."linkTitle" AS "linkTitle",
    		lp."projectType" AS "projectType",
    		lp."preview_img" AS "preview_img",
    		lp."sortOrder" AS "sortOrder",
            lp."visible" AS "visible",
            lp."featured" AS "featured",
			(
				CASE
					WHEN lp."projectType" = $7 THEN cqe."points" + se."points" + tt."expPoints"
					WHEN lp."projectType" = $8 THEN cqe."points" + lde."points" + tt."expPoints"
					ELSE cqe."points" + ge."points" + tt."expPoints"
				END
			) AS "totalExp"
    	FROM "loyalty_project" AS lp
    		INNER JOIN "loyalty_project_partner_projects_partner_project" AS lppp ON lp."id"=lppp."loyaltyProjectId"
    		LEFT JOIN "partner_project" AS pp ON lppp."partnerProjectId"=pp."id"
    		LEFT JOIN "resultRewards" AS rr ON rr."loyaltyProjectId"=lp."id"
			LEFT JOIN "tasksDone" AS td ON td."loyaltyProjectId"=lp."id"
			LEFT JOIN "totalTasks" AS tt ON tt."loyaltyProjectId"=lp."id"
			LEFT JOIN "commonQuestExp" AS cqe ON TRUE
			LEFT JOIN "scoreboardExp" AS se ON TRUE
			LEFT JOIN "luckyDrawExp" AS lde ON TRUE
			LEFT JOIN "guaranteedExp" AS ge ON TRUE
    	GROUP BY lp."id", rr."rewards", td."count", tt."count", cqe."points", se."points", tt."expPoints", lde."points", ge."points"
    )
    SELECT
    	rlp."id",
    	rlp."partnerProjects",
		rlp."tasksCount",
    	rlp."status",
    	rlp."startAt",
    	rlp."endAt",
    	rlp."title",
    	rlp."rewards",
    	rlp."linkTitle",
    	rlp."projectType",
    	rlp."preview_img",
    	rlp."questStatus",
		rlp."totalExp"
    FROM "resultLoyaltyProject" AS rlp
`;

export const GET_LOYALTY_PROJECTS_COUNT = `
	,"resultLoyaltyProject" AS (
		SELECT
			lp."id" AS "id",
			jsonb_agg(
				json_build_object(
					'logo', pp."logo",
					'verificationIcon', pp."verificationIcon",
					'name', pp."name",
					'linkTitle', pp."linkTitle"
				)
			) AS "partnerProjects",
			(
    		 CASE
    	    	WHEN lp."startAt" IS NULL OR lp."startAt" > NOW() THEN $1
    		    WHEN lp."endAt" <= NOW() THEN $2
    		    WHEN EXISTS (
    			      SELECT 1
    	    		  FROM "task_progress"
    			      WHERE "task_progress"."loyaltyProjectId" = lp."id"
    	    		    AND "task_progress"."investorId" = $5
    			    ) THEN $3
    	    	ELSE $4
    		  END
    		) AS "status",
			lp."startAt" AS "startAt",
			lp."endAt" AS "endAt",
			COALESCE(lp."title", lp."projectName") AS "title",
			lp."linkTitle" AS "linkTitle",
			lp."projectType" AS "projectType",
			lp."preview_img" AS "preview_img",
			lp."sortOrder" AS "sortOrder",
			lp."visible" AS "visible",
	        lp."featured" AS "featured"
		FROM "loyalty_project" AS lp
			INNER JOIN "loyalty_project_partner_projects_partner_project" AS lppp ON lp."id"=lppp."loyaltyProjectId"
			LEFT JOIN "partner_project" AS pp ON lppp."partnerProjectId"=pp."id"
		GROUP BY lp."id"
	)
	SELECT
		COUNT(*) AS "total"
	FROM "resultLoyaltyProject" AS rlp
`;

export const FILTER_BY_SEARCH_TITLE = `
    (LOWER(rlp."title") LIKE '%' || LOWER($6) || '%')
`;

export const FILTER_BY_VISIBLE = `
    (rlp."visible"=TRUE)
`;

export const FILTER_BY_FEATURED = `
    (rlp."featured"=TRUE)
`;

export const filterByPartnerQuery = (partner: string) => `
    (rlp."partnerProjects"@>'[{"linkTitle": "${partner}"}]')
`;

export const filterByTrendingQuery = (trendingIds: number[]) => `
    (rlp."id" IN (${trendingIds.length ? trendingIds : [0]}))
`;

export const filterByNewest = (minDate: string) => `
    (rlp."startAt" > '${minDate}')
`;

export const FILTER_BY_WHITELIST = `
    (
		EXISTS(SELECT 1 FROM "resultTokens" AS rt WHERE rt."loyaltyProjectId"=rlp."id" AND rt."type"='whitelist')
    )
`;

export const FILTER_BY_NFT = `
    (
		EXISTS(SELECT 1 FROM "resultTokens" AS rt WHERE rt."loyaltyProjectId"=rlp."id" AND rt."type"='nft')
    )
`;

export const FILTER_BY_TOKEN = `
	(
		NOT EXISTS (SELECT 1 FROM "resultTokens" AS rt WHERE rt."loyaltyProjectId"=rlp."id" AND (rt."type"='nft' OR rt."type"='aq' OR rt."type"='whitelist') ) AND EXISTS (SELECT 1 FROM "resultTokens" AS rt WHERE rt."loyaltyProjectId"=rlp."id")
	)
`;

export const FILTER_BY_ACTIVE = `
    (rlp."status"= $4)
`;

export const FILTER_BY_EXPIRED = `
    (rlp."status"= $2)
`;

export const FILTER_BY_PARTICIPATING = `
    (rlp."status"= $3)
`;

export const FILTER_BY_SOON = `
    (rlp."status"= $1)
`;

export const SORT_BY_CUSTOM_SORT_ORDER = `
    ORDER BY (
      CASE
        WHEN (rlp."sortOrder" IS NOT NULL) THEN 10000000000 + rlp."sortOrder"
        WHEN (rlp."status"= $4 OR "rlp"."status"= $3) THEN 20000000000 + (CASE WHEN (rlp."endAt" IS NULL) THEN 0 ELSE (SELECT EXTRACT(EPOCH FROM rlp."endAt")) END) - (SELECT EXTRACT(EPOCH FROM NOW()))
        WHEN (rlp."status"= $1 AND rlp."startAt" IS NOT NULL) THEN 30000000000 + (SELECT EXTRACT(EPOCH FROM rlp."startAt"))
        WHEN (rlp."status"= $1 AND rlp."startAt" IS NULL) THEN 40000000000 + rlp."id"
        WHEN (rlp."status"= $2) THEN 50000000000 - (SELECT EXTRACT(EPOCH FROM rlp."endAt"))
        ELSE 50000000000
      END
    ), rlp."id"
`;

export const PAGINATE = `
    LIMIT $9 OFFSET $10
`;

export const getLoyaltyProjectQuery = ({ isOwner }: { isOwner: boolean }) => `
		WITH "dailySubTasks" AS (
			SELECT
				lt."id" AS "loyaltyTaskId",
				(lt."body" ->> 'description') AS "description",
				jsonb_array_elements(lt."body" -> 'subTasks') AS "subTask",
				jsonb_array_length(lt."body" -> 'subTasks') AS "length"
			FROM loyalty_project AS lp
				LEFT JOIN "loyalty_task" AS lt ON lt."loyaltyProjectId"=lp."id"
			WHERE lp."linkTitle"=$1 AND lt."type"='daily'
		),
		"dailyCompletedSubTasks" AS (
			SELECT
				lt."id" AS "loyaltyTaskId",
				jsonb_array_elements(tp."json") AS "completedSubTask"
			FROM loyalty_project AS lp
				LEFT JOIN "loyalty_task" AS lt ON lt."loyaltyProjectId"=lp."id"
				RIGHT JOIN "task_progress" AS tp ON tp."loyaltyTaskId"=lt."id" AND tp."investorId"=$2
			WHERE lp."linkTitle"=$1 AND lt."type"='daily'
		),
		"dailySubTasksData" AS (
			SELECT
				"dailySubTasks"."loyaltyTaskId" AS "loyaltyTaskId",
				("dailySubTasks"."subTask" -> 'id')::int AS "id",
				("dailySubTasks"."subTask" ->> 'endAt')::timestamptz AS "endAt",
				("dailySubTasks"."subTask" ->> 'regex')::varchar AS "regex",
				("dailySubTasks"."subTask" ->> 'title')::varchar AS "title",
				("dailySubTasks"."subTask" -> 'points')::int AS "points",
				("dailySubTasks"."subTask" ->> 'startAt')::timestamptz AS "startAt",
				("dailySubTasks"."subTask" ->> 'description')::varchar AS "description",
				(row_number() over(PARTITION BY "dailySubTasks"."loyaltyTaskId"))::int AS "index",
				"dailySubTasks"."length" AS "length",
				"dailySubTasks"."description" AS "taskDescription"
			FROM "dailySubTasks"
		),
		"dailySubTasksFilteredData" AS (
			SELECT
				*,
				(row_number() over(PARTITION BY dst."loyaltyTaskId"))::int AS "indexByTaskId"
			FROM "dailySubTasksData" AS dst
			WHERE (dst."index"=1 AND dst."startAt" > NOW())
				OR (dst."index"=dst."length" AND dst."endAt" <= NOW())
				OR (dst."endAt">=NOW())
		),
		"dailyCompletedSubTasksData" AS (
			SELECT
				"dailyCompletedSubTasks"."loyaltyTaskId" AS "loyaltyTaskId",
				("dailyCompletedSubTasks"."completedSubTask" -> 'id')::int AS "id",
				("dailyCompletedSubTasks"."completedSubTask" ->> 'answer')::varchar AS "answer",
				("dailyCompletedSubTasks"."completedSubTask" ->> 'status')::varchar AS "status"
			FROM "dailyCompletedSubTasks"
		),
		"dailyTaskBodies" AS (
			SELECT
				dst."loyaltyTaskId" AS "loyaltyTaskId",
				jsonb_build_object(
					'description', dst."taskDescription",
					'total', dst."length",
					'subTasks', jsonb_agg(
							CASE
								WHEN (dcst."id" IS NULL) THEN
									jsonb_build_object(
										'id', dst."id",
										'title', dst."title",
										'description', dst."description",
										'regex', dst."regex",
										'startAt', dst."startAt",
										'endAt', dst."endAt",
										'points', dst."points",
										'status', (
											CASE
												WHEN (NOW() < dst."endAt") THEN
													$3
												ELSE $4
											END
										)
									)
								ELSE
									jsonb_build_object(
										'id', dst."id",
										'title', dst."title",
										'description', dst."description",
										'regex', dst."regex",
										'startAt', dst."startAt",
										'endAt', dst."endAt",
										'points', dst."points",
										'answer', dcst."answer",
										'status', dcst."status"
									)
							END
						)
					) AS "dailyTaskBody"
			FROM "dailySubTasksFilteredData" AS dst
				LEFT JOIN "dailyCompletedSubTasksData" AS dcst ON dst."loyaltyTaskId"=dcst."loyaltyTaskId" AND dst."id"=dcst."id"
			WHERE (dst."index"=1 AND dst."startAt" > NOW())
				OR (dst."index"=dst."length" AND dst."endAt" <= NOW() AND dst."indexByTaskId"=1)
				OR (dst."endAt">=NOW() AND dst."indexByTaskId"=1)
			GROUP BY dst."loyaltyTaskId", dst."taskDescription", dst."length"
		),
		"tasksData" AS (
			SELECT
				lp."id" AS "loyaltyProjectId",
				lt."id" AS "id",
				lt."title" AS "title",
				lt."points" AS "points",
        		lt."startAt" AT TIME ZONE 'UTC' AS "startAt",
        		lt."endAt" AT TIME ZONE 'UTC'   AS "endAt",
				lt."type" AS "type",
				lt."sortOrder" AS "sortOrder",
				lt."required" AS "required",
				COALESCE((lt."body" -> 'isOnboardingTask')::boolean, FALSE) AS "isOnboardingTask",
				(
					CASE
						WHEN (lt."type" = $5) THEN
							(
								CASE
									WHEN ((NOT tp IS NULL) AND (NOT tp."json" IS NULL)) THEN
										(
											CASE
												WHEN (jsonb_array_length(tp."json") > 0) THEN
													jsonb_build_object(
														'answers', tp."json",
														'completedAt', tp."completedAt",
														'description', lt."body" ->> 'description',
														'maxAnswers', (lt."body" ->> 'maxAnswers')::int
													)
												ELSE jsonb_build_object('description', lt."body" ->> 'description')
											END
										)
									ELSE jsonb_build_object(
											'description', lt."body" ->> 'description'${
                        isOwner
                          ? `,
                      						'maxAnswers', (lt."body" ->> 'maxAnswers')::int,
                      						'answers', COALESCE((lt."body" ->> 'answers')::jsonb, '[]'::jsonb)`
                          : `,
											'maxAnswers', (lt."body" ->> 'maxAnswers')::int`
                      }
										)
								END
							)
						WHEN (lt."type" = $6) THEN
							(
								CASE
									WHEN (tp IS NULL) THEN
										jsonb_build_object('description', lt."body" ->> 'description')
									ELSE jsonb_build_object(
										'description', lt."body" ->> 'description',
										'suggestionDescription', tp."json" ->> 'description',
										'completedAt', tp."completedAt"
									)
								END
							)
						WHEN (lt."type" = $7) THEN
							(
								CASE
									WHEN (tp IS NULL) THEN
										jsonb_build_object('description', lt."body" ->> 'description')
									ELSE jsonb_build_object(
										'description', lt."body" ->> 'description',
										'email', tp."json" ->> 'email',
										'completedAt', tp."completedAt"
									)
								END
							)
						WHEN (lt."type" = $8) THEN
							(
								CASE
									WHEN (tp IS NULL) THEN
										jsonb_build_object(
											'description', lt."body" ->> 'description',
											'loyaltyTaskId', lt."id"
										)
									ELSE jsonb_build_object(
										'description', lt."body" ->> 'description',
										'completedAt', tp."completedAt"
									)
								END
							)
						WHEN (lt."type" = $9) THEN
							(
								CASE
									WHEN (tp IS NULL) THEN
										jsonb_build_object(
											'description', lt."body" ->> 'description',
										 	'mentionUserName', lt."body" ->> 'mentionUserName',
											'additionalProgram', (NOT (lt."body" ->> 'additionalProgram') IS NULL)
										)
									ELSE jsonb_build_object(
										'description', lt."body" ->> 'description',
										'mentionUserName', lt."body" ->> 'mentionUserName',
										'taskCompletedTweetId', tp."json" ->> 'tweetId',
										'additionalProgram', (
											CASE
												WHEN (((lt."body" ->> 'additionalProgram') IS NULL) OR (tp IS NULL)) THEN
													NULL
												ELSE jsonb_build_object(
													'additionalProgramEndAt', (tp."json" ->> 'unlimitedEndAt')::timestamptz,
													'likes', (tp."json" ->> 'unlimitedLikesCount')::int,
													'reTweets', (tp."json" ->> 'unlimitedReTweetsCount')::int,
													'totalEarned', (tp."json" ->> 'unlimitedEarnedPoints')::int,
													'individualDuration', (NOT (lt."body" -> 'additionalProgram' ->> 'individualDuration') IS NULL)
												)
											END
										),
										'completedAt', tp."completedAt"
									)
								END
							)
						WHEN (lt."type" = $10 OR lt."type" = $28 OR lt."type" = $29) THEN
							(
								CASE
									WHEN (tp IS NULL) THEN
										jsonb_build_object(
											'description', lt."body" ->> 'description',
										 	'tweetId', lt."body" ->> 'tweetId',
											'additionalProgram', (NOT (lt."body" ->> 'additionalProgram') IS NULL)
										)
									ELSE jsonb_build_object(
										'description', lt."body" ->> 'description',
										'tweetId', lt."body" ->> 'tweetId',
										'taskCompletedTweetId', tp."json" ->> 'tweetId',
										'additionalProgram', (
											CASE
												WHEN (((lt."body" ->> 'additionalProgram') IS NULL) OR (tp IS NULL)) THEN
													NULL
												ELSE jsonb_build_object(
													'additionalProgramEndAt', (tp."json" ->> 'unlimitedEndAt')::timestamptz,
													'likes', (tp."json" ->> 'unlimitedLikesCount')::int,
													'reTweets', (tp."json" ->> 'unlimitedReTweetsCount')::int,
													'totalEarned', (tp."json" ->> 'unlimitedEarnedPoints')::int,
													'individualDuration', (NOT (lt."body" -> 'additionalProgram' ->> 'individualDuration') IS NULL)
												)
											END
										),
										'completedAt', tp."completedAt"
									)
								END
							)
						WHEN (lt."type" = $11) THEN
							(
								CASE
									WHEN (tp IS NULL) THEN
										jsonb_build_object(
											'description', lt."body" ->> 'description',
											'partnerProjectLink', lt."body" -> 'partnerTask' ->> 'projectLink'
										)
									ELSE jsonb_build_object(
										'description', lt."body" ->> 'description',
										'completedAt', tp."completedAt"
									)
								END
							)
          WHEN (lt."type" = $30) THEN
              (
                CASE
                  WHEN (tp IS NULL) THEN
                    jsonb_build_object(
                      'description', lt."body" ->> 'description',
                      'partnerProjectLink', lt."body" -> 'partnerTask' ->> 'projectLink'
                      )
                  ELSE jsonb_build_object(
                    'description', lt."body" ->> 'description',
                    'completedAt', tp."completedAt"
                    )
                  END
                )
						WHEN (
							lt."type" = $12 OR
							lt."type" = $13 OR
							lt."type" = $14 OR
							lt."type" = $15 OR
							lt."type" = $16
						) THEN
							(
								CASE
									WHEN (tp IS NULL) THEN
										lt."body"
									ELSE lt."body" || jsonb_build_object(
										'wallet', tp."json" ->> 'wallet',
										'amount', (tp."json" ->> 'amount')::numeric
									)
								END
							)
						WHEN (lt."type" = $17) THEN
							dtb."dailyTaskBody"
						WHEN (lt."type" = $18) THEN
							(
								CASE
									WHEN ((NOT tp IS NULL) AND (NOT (tp."json" -> 'imgSrc') IS NULL)) THEN
										jsonb_build_object(
											'imgSrc', tp."json" ->> 'imgSrc',
											'description', lt."body" ->> 'description',
											'completedAt', tp."completedAt"
										)
									ELSE jsonb_build_object(
										'description', lt."body" ->> 'description'
									)
								END
							)
						WHEN (lt."type" = $19) THEN
							(
								CASE
									WHEN (tp IS NULL) THEN
										lt."body"
									ELSE lt."body" || jsonb_build_object(
										'inviteCode', tp."json" ->> 'inviteCode',
										'inviteCount', (
											CASE
												WHEN (NOT (tp."json" -> 'invitedInvestorIds') IS NULL) THEN
													jsonb_array_length(tp."json" -> 'invitedInvestorIds')
												ELSE 0
											END
										),
										'totalEarned', tp."earnedPoints"
									)
								END
							)
						ELSE (
							CASE
								WHEN (NOT tp IS NULL) THEN
									lt."body" || jsonb_build_object('completedAt', COALESCE(tp."completedAt", tp."createdDate"))
								ELSE lt."body"
							END
						)
					END
				) AS "body",
				(
					CASE
						WHEN (lt."type"=$17) THEN
							(
								CASE
									WHEN (NOT tp IS NULL) THEN
										(
											CASE
												WHEN (
													((tp."json" -> -1 ->> 'id')::int = (lt."body" -> 'subTasks' -> -1 ->> 'id')::int)
													OR
													(jsonb_array_length(lt."body"->'subTasks') = jsonb_array_length(tp."json"))
												) THEN
													(
														CASE
															WHEN (tp."json" @> '[{"status": "confirmed"}]') THEN
																$20
															ELSE $4
														END
													)
												WHEN (NOW() >= (lt."body" -> 'subTasks' -> -1 ->> 'endAt')::timestamptz) THEN
													(
														CASE
															WHEN (tp."json" @> '[{"status": "confirmed"}]') THEN
																$20
															ELSE $4
														END
													)
												ELSE $3
											END
										)
									WHEN (NOW() >= (lt."body" -> 'subTasks' -> -1 ->> 'endAt')::timestamptz) THEN
										$4
									ELSE $3
								END
							)
						WHEN (lt."type"=$5) THEN
							(
								CASE
									WHEN (NOT tp IS NULL) THEN
										(
											CASE
												WHEN (NOT tp."completedAt" IS NULL) THEN
													$20
												WHEN ((lt."body" ->> 'maxAnswers')::int > jsonb_array_length(tp."json")) THEN
													$3
												ELSE $4
											END
										)
									WHEN ((NOT lt."endAt" IS NULL) AND (NOW() >= lt."endAt")) THEN
										$4
									ELSE $3
								END
							)
						WHEN (lt."type"=$18) THEN
							(
								CASE
									WHEN (NOT tp IS NULL) THEN
										(
											CASE
												WHEN (NOT tp."completedAt" IS NULL) THEN
													$20
												ELSE $3
											END
										)
									WHEN ((NOT lt."endAt" IS NULL) AND (NOW() >= lt."endAt")) THEN
										$4
									ELSE $3
								END
							)
			 			WHEN (NOT tp IS NULL) THEN
							(
								CASE
									WHEN (NOT (tp."json" ->> 'unlimitedEndAt')::timestamptz IS NULL) THEN
										(
											CASE
												WHEN (NOW() > (tp."json" ->> 'unlimitedEndAt')::timestamptz) THEN
													$20
												ELSE $21
											END
										)
									ELSE $20
								END
							)
						WHEN ((NOT lt."endAt" IS NULL) AND (NOW() > lt."endAt")) THEN
							$4
						WHEN ((lt."type" = $27 OR lt."type" = $19) AND (NOT tp IS NULL)) THEN
							$20
						ELSE $3
					END
				) AS "status",
				COALESCE(et."points", 0) AS "expPoints"
			FROM "loyalty_project" AS lp
				RIGHT JOIN "loyalty_task" AS lt ON lt."loyaltyProjectId"=lp."id"
				LEFT JOIN "experience_task" AS et ON lt."experienceTaskId" = et."id"
				LEFT JOIN "task_progress" AS tp ON tp."loyaltyTaskId"=lt."id" AND tp."investorId"=$2
				LEFT JOIN "dailyTaskBodies" AS dtb ON lt."id"=dtb."loyaltyTaskId"
			WHERE lp."linkTitle"=$1
		),
		"loyaltyTasks" AS (
			SELECT
				lp."id" AS "loyaltyProjectId",
				(
					CASE
						WHEN (COUNT(td."id")=0) THEN '[]'::jsonb
					ELSE
						jsonb_agg(
							jsonb_build_object(
								'id', td."id",
								'title', td."title",
								'points', td."points",
								'startAt', td."startAt",
								'endAt', td."endAt",
								'type', td."type",
								'sortOrder', td."sortOrder",
								'required', td."required",
								'isOnboardingTask', td."isOnboardingTask",
								'body', td."body",
								'status', td."status",
								'expPoints', td."expPoints",
                'sortOrder', td."sortOrder"
                ) ORDER BY td."sortOrder"
						)
					END
				) AS "loyaltyTasks"
			FROM "loyalty_project" AS lp
				LEFT JOIN "tasksData" AS td ON lp."id"=td."loyaltyProjectId"
			WHERE lp."linkTitle"=$1
			GROUP BY lp."id"
		),
		"resultTokens" AS (
		   	SELECT
				lr."loyaltyProjectId" AS "loyaltyProjectId",
				t."symbol" AS "symbol",
				t."logo" AS "logo",
				(CASE
		 			WHEN lp."projectType"=$22 THEN CEIL(SUM(lr."amount" * (lr."endPlace" - lr."startPlace" + 1)))
		   	 		ELSE CEIL(SUM(lr."amount"))
				 END) AS "amount"
			FROM "loyalty_reward" AS lr
				LEFT JOIN "contract" AS t ON lr."contractId"=t."id"
				LEFT JOIN "loyalty_project" AS lp ON lr."loyaltyProjectId"=lp."id"
			WHERE lp."linkTitle"=$1 AND lr."verified"=TRUE
			GROUP BY
				lr."loyaltyProjectId",
				lr."contractId",
				t."symbol",
				t."logo",
				lp."projectType"
		),
		"resultRewards" AS (
		   	SELECT
    			"resultTokens"."loyaltyProjectId" AS "loyaltyProjectId",
    			jsonb_agg(
   					jsonb_build_object(
   						'symbol', "resultTokens"."symbol",
   						'logo', "resultTokens"."logo",
   						'amount', "resultTokens"."amount"
   					)
   				) AS "rewards"
   			FROM "resultTokens"
   			WHERE "resultTokens"."amount">0
   			GROUP BY "resultTokens"."loyaltyProjectId"
		),
		"resultLoyaltyProject" AS (
		   	SELECT
				lp."questStatus" AS "questStatus",
		   		lp."id" AS "id",
		   		jsonb_agg(
		   			json_build_object(
		   				'logo', pp."logo",
		   				'verificationIcon', pp."verificationIcon",
		   				'name', pp."name",
		   				'linkTitle', pp."linkTitle"
		   			)
		    	) AS "partnerProjects",
		    	(
		   		 CASE
		   	    	WHEN lp."startAt" IS NULL OR lp."startAt" > NOW() THEN $23
		   		    WHEN lp."endAt" <= NOW() THEN $24
					WHEN NULL::integer IS NULL THEN $26
		   		    WHEN EXISTS (
		   			      SELECT 1
		   	    		  FROM "task_progress"
		   			      WHERE "task_progress"."loyaltyProjectId" = lp."id"
		   	    		    AND "task_progress"."investorId" = $2
		   			    ) THEN $25
		   	    	ELSE $26
		   		  END
		   		) AS "status",
		   		lp."startAt" AS "startAt",
		   		lp."endAt" AS "endAt",
				lp."claimingStartAt" AS "claimingStartAt",
				lp."claimingEndAt" AS "claimingEndAt",
		   		COALESCE(lp."title", lp."projectName") AS "title",
		   		(
					jsonb_build_object(
						'tokens', COALESCE(rr."rewards", '[]'::jsonb)
		   			)
		   		) AS "rewards",
		   		lp."linkTitle" AS "linkTitle",
		   		lp."projectType" AS "projectType",
				lp."description" AS "description",
				lp."socialDescription" AS "socialDescription",
		   		lp."preview_img" AS "preview_img",
		   		lp."sortOrder" AS "sortOrder",
				lp."eligibleUsersCount" AS "eligibleUsersCount",
				lp."threshold" AS "threshold",
		        lp."visible" AS "visible",
				lp."featured" AS "featured",
				(SELECT COUNT(DISTINCT tp."investorId")::int FROM "task_progress" AS tp WHERE tp."loyaltyProjectId"=lp."id") AS "participants",
				"loyaltyTasks"."loyaltyTasks" AS "loyaltyTasks"
		    FROM "loyalty_project" AS lp
		   		INNER JOIN "loyalty_project_partner_projects_partner_project" AS lppp ON lp."id"=lppp."loyaltyProjectId"
		   		LEFT JOIN "partner_project" AS pp ON lppp."partnerProjectId"=pp."id"
		   		LEFT JOIN "resultRewards" AS rr ON rr."loyaltyProjectId"=lp."id"
				LEFT JOIN "loyaltyTasks" ON "loyaltyTasks"."loyaltyProjectId"=lp."id"
			WHERE lp."linkTitle"=$1
		   	GROUP BY lp."id", rr."rewards", "loyaltyTasks"."loyaltyTasks"
		)
		  SELECT
			rlp."id",
			rlp."linkTitle",
			rlp."title",
		   	rlp."partnerProjects",
		   	rlp."status",
			rlp."projectType",
			rlp."rewards",
		   	rlp."startAt",
		   	rlp."endAt",
			rlp."claimingStartAt",
		   	rlp."claimingEndAt",
		   	rlp."description",
		   	rlp."socialDescription",
		   	rlp."loyaltyTasks",
			rlp."preview_img",
			rlp."eligibleUsersCount",
			rlp."threshold",
			rlp."participants",
			rlp."questStatus"
		FROM "resultLoyaltyProject" AS rlp
`;

export const getLoyaltyProjectLocalizedQuery = ({ isOwner, language }: { isOwner: boolean; language: string }) => `
	WITH "dailySubTasks" AS (
		SELECT
			lt."id" AS "loyaltyTaskId",
			(lt."body" ->> 'description') AS "description",
			jsonb_array_elements(lt."body" -> 'subTasks') AS "subTask",
			jsonb_array_length(lt."body" -> 'subTasks') AS "length"
		FROM loyalty_project AS lp
			LEFT JOIN "loyalty_task" AS lt ON lt."loyaltyProjectId"=lp."id"
		WHERE lp."linkTitle"=$1 AND lt."type"='daily'
	),
	"dailyCompletedSubTasks" AS (
		SELECT
			lt."id" AS "loyaltyTaskId",
			jsonb_array_elements(tp."json") AS "completedSubTask"
		FROM loyalty_project AS lp
			LEFT JOIN "loyalty_task" AS lt ON lt."loyaltyProjectId"=lp."id"
			RIGHT JOIN "task_progress" AS tp ON tp."loyaltyTaskId"=lt."id" AND tp."investorId"=$2
		WHERE lp."linkTitle"=$1 AND lt."type"='daily'
	),
	"dailySubTasksData" AS (
		SELECT
			"dailySubTasks"."loyaltyTaskId" AS "loyaltyTaskId",
			("dailySubTasks"."subTask" -> 'id')::int AS "id",
			("dailySubTasks"."subTask" ->> 'endAt')::timestamptz AS "endAt",
			("dailySubTasks"."subTask" ->> 'regex')::varchar AS "regex",
			("dailySubTasks"."subTask" ->> 'title')::varchar AS "title",
			("dailySubTasks"."subTask" -> 'points')::int AS "points",
			("dailySubTasks"."subTask" ->> 'startAt')::timestamptz AS "startAt",
			("dailySubTasks"."subTask" ->> 'description')::varchar AS "description",
			(row_number() over(PARTITION BY "dailySubTasks"."loyaltyTaskId"))::int AS "index",
			"dailySubTasks"."length" AS "length",
			"dailySubTasks"."description" AS "taskDescription"
		FROM "dailySubTasks"
	),
	"dailySubTasksFilteredData" AS (
		SELECT
			*,
			(row_number() over(PARTITION BY dst."loyaltyTaskId"))::int AS "indexByTaskId"
		FROM "dailySubTasksData" AS dst
		WHERE (dst."index"=1 AND dst."startAt" > NOW())
			OR (dst."index"=dst."length" AND dst."endAt" <= NOW())
			OR (dst."endAt">=NOW())
	),
	"dailyCompletedSubTasksData" AS (
		SELECT
			"dailyCompletedSubTasks"."loyaltyTaskId" AS "loyaltyTaskId",
			("dailyCompletedSubTasks"."completedSubTask" -> 'id')::int AS "id",
			("dailyCompletedSubTasks"."completedSubTask" ->> 'answer')::varchar AS "answer",
			("dailyCompletedSubTasks"."completedSubTask" ->> 'status')::varchar AS "status"
		FROM "dailyCompletedSubTasks"
	),
	"dailyTaskBodies" AS (
		SELECT
			dst."loyaltyTaskId" AS "loyaltyTaskId",
			jsonb_build_object(
				'description', dst."taskDescription",
				'total', dst."length",
				'subTasks', jsonb_agg(
						CASE
							WHEN (dcst."id" IS NULL) THEN
								jsonb_build_object(
									'id', dst."id",
									'title', dst."title",
									'description', dst."description",
									'regex', dst."regex",
									'startAt', dst."startAt",
									'endAt', dst."endAt",
									'points', dst."points",
									'status', (
										CASE
											WHEN (NOW() < dst."endAt") THEN
												$3
											ELSE $4
										END
									)
								)
							ELSE
								jsonb_build_object(
									'id', dst."id",
									'title', dst."title",
									'description', dst."description",
									'regex', dst."regex",
									'startAt', dst."startAt",
									'endAt', dst."endAt",
									'points', dst."points",
									'answer', dcst."answer",
									'status', dcst."status"
								)
						END
					)
				) AS "dailyTaskBody"
		FROM "dailySubTasksFilteredData" AS dst
			LEFT JOIN "dailyCompletedSubTasksData" AS dcst ON dst."loyaltyTaskId"=dcst."loyaltyTaskId" AND dst."id"=dcst."id"
		WHERE (dst."index"=1 AND dst."startAt" > NOW())
			OR (dst."index"=dst."length" AND dst."endAt" <= NOW() AND dst."indexByTaskId"=1)
			OR (dst."endAt">=NOW() AND dst."indexByTaskId"=1)
		GROUP BY dst."loyaltyTaskId", dst."taskDescription", dst."length"
	),
	"localizedTasksData" AS (
		SELECT
			lt."id" AS "id",
			lzt."body" AS "title",
	        lzd."body" AS "description",
	        lzv."body" AS "videoId",
	        lzb."body" AS "buttonText",
	        lzot."body" AS "onboardingTitle",
	        lzod."body" AS "onboardingDescription"
		FROM "loyalty_project" AS lp
			LEFT JOIN "loyalty_task" AS lt ON lt."loyaltyProjectId"=lp."id"
			LEFT JOIN "localization" AS lzt ON lzt."objId" = lt."localizationId" AND lzt."fieldType"='title' AND lzt."lang"='${language}'
	        LEFT JOIN "localization" AS lzd ON lzd."objId" = lt."localizationId" AND lzd."fieldType"='description' AND lzd."lang"='${language}'
	        LEFT JOIN "localization" AS lzv ON lzv."objId" = lt."localizationId" AND lzv."fieldType"='videoId' AND lzv."lang"='${language}'
	        LEFT JOIN "localization" AS lzb ON lzb."objId" = lt."localizationId" AND lzb."fieldType"='buttonText' AND lzb."lang"='${language}'
	        LEFT JOIN "localization" AS lzot ON lzot."objId" = lt."localizationId" AND lzot."fieldType"='onboardingTitle' AND lzot."lang"='${language}'
	        LEFT JOIN "localization" AS lzod ON lzod."objId" = lt."localizationId" AND lzod."fieldType"='onboardingDescription' AND lzod."lang"='${language}'
		WHERE lp."linkTitle"=$1
	),
	"tasksData" AS (
		SELECT
			lp."id" AS "loyaltyProjectId",
			lt."id" AS "id",
			COALESCE(ltd."title", lt."title") AS "title",
			lt."points" AS "points",
      		lt."startAt" AT TIME ZONE 'UTC' AS "startAt",
      		lt."endAt" AT TIME ZONE 'UTC'   AS "endAt",
			lt."type" AS "type",
			lt."sortOrder" AS "sortOrder",
			lt."required" AS "required",
			COALESCE((lt."body" -> 'isOnboardingTask')::boolean, FALSE) AS "isOnboardingTask",
			(
				CASE
					WHEN (lt."type" = $5) THEN
						(
							CASE
								WHEN ((NOT tp IS NULL) AND (NOT tp."json" IS NULL)) THEN
									(
										CASE
											WHEN (jsonb_array_length(tp."json") > 0) THEN
												jsonb_build_object(
													'answers', tp."json",
													'completedAt', tp."completedAt",
													'description', COALESCE(ltd."description", lt."body" ->> 'description'),
													'maxAnswers', (lt."body" ->> 'maxAnswers')::int
												)
											ELSE jsonb_build_object('description', COALESCE(ltd."description", lt."body" ->> 'description'))
										END
									)
								ELSE jsonb_build_object(
										'description', COALESCE(ltd."description", lt."body" ->> 'description')${
                      isOwner
                        ? `,
                    					'maxAnswers', (lt."body" ->> 'maxAnswers')::int,
                    					'answers', COALESCE((lt."body" ->> 'answers')::jsonb, '[]'::jsonb)`
                        : `,
										'maxAnswers', (lt."body" ->> 'maxAnswers')::int`
                    }
									)
							END
						)
					WHEN (lt."type" = $6) THEN
						(
							CASE
								WHEN (tp IS NULL) THEN
									jsonb_build_object('description', COALESCE(ltd."description", lt."body" ->> 'description'))
								ELSE jsonb_build_object(
									'description', COALESCE(ltd."description", lt."body" ->> 'description'),
									'suggestionDescription', tp."json" ->> 'description',
									'completedAt', tp."completedAt"
								)
							END
						)
					WHEN (lt."type" = $7) THEN
						(
							CASE
								WHEN (tp IS NULL) THEN
									jsonb_build_object('description', COALESCE(ltd."description", lt."body" ->> 'description'))
								ELSE jsonb_build_object(
									'description', COALESCE(ltd."description", lt."body" ->> 'description'),
									'email', tp."json" ->> 'email',
									'completedAt', tp."completedAt"
								)
							END
						)
					WHEN (lt."type" = $8) THEN
						(
							CASE
								WHEN (tp IS NULL) THEN
									jsonb_build_object(
										'description', COALESCE(ltd."description", lt."body" ->> 'description'),
										'loyaltyTaskId', lt."id"
									)
								ELSE jsonb_build_object(
									'description', COALESCE(ltd."description", lt."body" ->> 'description'),
									'completedAt', tp."completedAt"
								)
							END
						)
					WHEN (lt."type" = $9) THEN
						(
							CASE
								WHEN (tp IS NULL) THEN
									jsonb_build_object(
										'description', COALESCE(ltd."description", lt."body" ->> 'description'),
									 	'mentionUserName', lt."body" ->> 'mentionUserName',
										'additionalProgram', (NOT (lt."body" ->> 'additionalProgram') IS NULL)
									)
								ELSE jsonb_build_object(
									'description', COALESCE(ltd."description", lt."body" ->> 'description'),
									'mentionUserName', lt."body" ->> 'mentionUserName',
									'taskCompletedTweetId', tp."json" ->> 'tweetId',
									'additionalProgram', (
										CASE
											WHEN (((lt."body" ->> 'additionalProgram') IS NULL) OR (tp IS NULL)) THEN
												NULL
											ELSE jsonb_build_object(
												'additionalProgramEndAt', (tp."json" ->> 'unlimitedEndAt')::timestamptz,
												'likes', (tp."json" ->> 'unlimitedLikesCount')::int,
												'reTweets', (tp."json" ->> 'unlimitedReTweetsCount')::int,
												'totalEarned', (tp."json" ->> 'unlimitedEarnedPoints')::int,
												'individualDuration', (NOT (lt."body" -> 'additionalProgram' ->> 'individualDuration') IS NULL)
											)
										END
									),
									'completedAt', tp."completedAt"
								)
							END
						)
					WHEN (lt."type" = $10 OR lt."type" = $28 OR lt."type" = $29) THEN
						(
							CASE
								WHEN (tp IS NULL) THEN
									jsonb_build_object(
										'description', COALESCE(ltd."description", lt."body" ->> 'description'),
									 	'tweetId', lt."body" ->> 'tweetId',
										'additionalProgram', (NOT (lt."body" ->> 'additionalProgram') IS NULL)
									)
								ELSE jsonb_build_object(
									'description', COALESCE(ltd."description", lt."body" ->> 'description'),
									'tweetId', lt."body" ->> 'tweetId',
									'taskCompletedTweetId', tp."json" ->> 'tweetId',
									'additionalProgram', (
										CASE
											WHEN (((lt."body" ->> 'additionalProgram') IS NULL) OR (tp IS NULL)) THEN
												NULL
											ELSE jsonb_build_object(
												'additionalProgramEndAt', (tp."json" ->> 'unlimitedEndAt')::timestamptz,
												'likes', (tp."json" ->> 'unlimitedLikesCount')::int,
												'reTweets', (tp."json" ->> 'unlimitedReTweetsCount')::int,
												'totalEarned', (tp."json" ->> 'unlimitedEarnedPoints')::int,
												'individualDuration', (NOT (lt."body" -> 'additionalProgram' ->> 'individualDuration') IS NULL)
											)
										END
									),
									'completedAt', tp."completedAt"
								)
							END
						)
					WHEN (lt."type" = $11) THEN
						(
							CASE
								WHEN (tp IS NULL) THEN
									jsonb_build_object(
										'description', COALESCE(ltd."description", lt."body" ->> 'description'),
										'partnerProjectLink', lt."body" -> 'partnerTask' ->> 'projectLink'
									)
								ELSE jsonb_build_object(
									'description', COALESCE(ltd."description", lt."body" ->> 'description'),
									'completedAt', tp."completedAt"
								)
							END
						)
          WHEN (lt."type" = $30) THEN
            (
              CASE
                WHEN (tp IS NULL) THEN
                  jsonb_build_object(
                    'description', lt."body" ->> 'description',
                    'partnerProjectLink', lt."body" -> 'partnerTask' ->> 'projectLink'
                    )
                ELSE jsonb_build_object(
                  'description', lt."body" ->> 'description',
                  'completedAt', tp."completedAt"
                  )
                END
              )
					WHEN (
						lt."type" = $12 OR
						lt."type" = $13 OR
						lt."type" = $14 OR
						lt."type" = $15 OR
						lt."type" = $16
					) THEN
						(
							CASE
								WHEN (tp IS NULL) THEN
									lt."body" || jsonb_build_object(
	                                    'description', COALESCE(ltd."description", lt."body" ->> 'description')
	                                )
								ELSE lt."body" || jsonb_build_object(
									'wallet', tp."json" ->> 'wallet',
									'amount', (tp."json" ->> 'amount')::numeric
								) || jsonb_build_object(
	                                    'description', COALESCE(ltd."description", lt."body" ->> 'description')
	                                )
							END
						)
					WHEN (lt."type" = $17) THEN
						dtb."dailyTaskBody"
					WHEN (lt."type" = $18) THEN
						(
							CASE
								WHEN ((NOT tp IS NULL) AND (NOT (tp."json" -> 'imgSrc') IS NULL)) THEN
									jsonb_build_object(
										'imgSrc', tp."json" ->> 'imgSrc',
										'description', COALESCE(ltd."description", lt."body" ->> 'description'),
										'completedAt', tp."completedAt"
									)
								ELSE jsonb_build_object(
									'description', COALESCE(ltd."description", lt."body" ->> 'description')
								)
							END
						)
					WHEN (lt."type" = $19) THEN
						(
							CASE
								WHEN (tp IS NULL) THEN
									lt."body" || jsonb_build_object(
	                                    'description', COALESCE(ltd."description", lt."body" ->> 'description')
	                                )
								ELSE lt."body" || jsonb_build_object(
									'inviteCode', tp."json" ->> 'inviteCode',
									'inviteCount', (
										CASE
											WHEN (NOT (tp."json" -> 'invitedInvestorIds') IS NULL) THEN
												jsonb_array_length(tp."json" -> 'invitedInvestorIds')
											ELSE 0
										END
									),
									'totalEarned', tp."earnedPoints"
								) || jsonb_build_object(
	                                    'description', COALESCE(ltd."description", lt."body" ->> 'description')
	                                )
							END
						)
					ELSE (
						CASE
							WHEN (NOT tp IS NULL) THEN
								(
	                                CASE
	                                    WHEN COALESCE((lt."body" -> 'isOnboardingTask')::boolean, FALSE) THEN
	                                        lt."body" || jsonb_build_object('completedAt', COALESCE(tp."completedAt", tp."createdDate")) || jsonb_build_object(
	                                            'description', COALESCE(ltd."description", lt."body" ->> 'description'),
	                                            'videoId', COALESCE(ltd."videoId", lt."body" ->> 'videoId'),
	                                            'buttonText', COALESCE(ltd."buttonText", lt."body" ->> 'buttonText'),
	                                            'onboardingTitle', COALESCE(ltd."onboardingTitle", lt."body" ->> 'onboardingTitle'),
	                                            'onboardingDescription', COALESCE(ltd."onboardingDescription", lt."body" ->> 'onboardingDescription')
	                                        )
	                                    ELSE
	                                        lt."body" || jsonb_build_object('completedAt', COALESCE(tp."completedAt", tp."createdDate")) || jsonb_build_object(
	                                            'description', COALESCE(ltd."description", lt."body" ->> 'description')
	                                        )
	                                END
	                            )
							ELSE
	                            (
	                                CASE
	                                    WHEN COALESCE((lt."body" -> 'isOnboardingTask')::boolean, FALSE) THEN
	                                        lt."body" || jsonb_build_object(
	                                            'description', COALESCE(ltd."description", lt."body" ->> 'description')
	                                        ) || jsonb_build_object(
	                                            'description', COALESCE(ltd."description", lt."body" ->> 'description'),
	                                            'videoId', COALESCE(ltd."videoId", lt."body" ->> 'videoId'),
	                                            'buttonText', COALESCE(ltd."buttonText", lt."body" ->> 'buttonText'),
	                                            'onboardingTitle', COALESCE(ltd."onboardingTitle", lt."body" ->> 'onboardingTitle'),
	                                            'onboardingDescription', COALESCE(ltd."onboardingDescription", lt."body" ->> 'onboardingDescription')
	                                        )
	                                    ELSE
	                                        lt."body" || jsonb_build_object(
	                                            'description', COALESCE(ltd."description", lt."body" ->> 'description')
	                                        )
	                                END
	                            )
						END
					)
				END
			) AS "body",
			(
				CASE
					WHEN (lt."type"=$17) THEN
						(
							CASE
								WHEN (NOT tp IS NULL) THEN
									(
										CASE
											WHEN (
												((tp."json" -> -1 ->> 'id')::int = (lt."body" -> 'subTasks' -> -1 ->> 'id')::int)
												OR
												(jsonb_array_length(lt."body"->'subTasks') = jsonb_array_length(tp."json"))
											) THEN
												(
													CASE
														WHEN (tp."json" @> '[{"status": "confirmed"}]') THEN
															$20
														ELSE $4
													END
												)
											WHEN (NOW() >= (lt."body" -> 'subTasks' -> -1 ->> 'endAt')::timestamptz) THEN
												(
													CASE
														WHEN (tp."json" @> '[{"status": "confirmed"}]') THEN
															$20
														ELSE $4
													END
												)
											ELSE $3
										END
									)
								WHEN (NOW() >= (lt."body" -> 'subTasks' -> -1 ->> 'endAt')::timestamptz) THEN
									$4
								ELSE $3
							END
						)
					WHEN (lt."type"=$5) THEN
						(
							CASE
								WHEN (NOT tp IS NULL) THEN
									(
										CASE
											WHEN (NOT tp."completedAt" IS NULL) THEN
												$20
											WHEN ((lt."body" ->> 'maxAnswers')::int > jsonb_array_length(tp."json")) THEN
												$3
											ELSE $4
										END
									)
								WHEN ((NOT lt."endAt" IS NULL) AND (NOW() >= lt."endAt")) THEN
									$4
								ELSE $3
							END
						)
					WHEN (lt."type"=$18) THEN
						(
							CASE
								WHEN (NOT tp IS NULL) THEN
									(
										CASE
											WHEN (NOT tp."completedAt" IS NULL) THEN
												$20
											ELSE $3
										END
									)
								WHEN ((NOT lt."endAt" IS NULL) AND (NOW() >= lt."endAt")) THEN
									$4
								ELSE $3
							END
						)
		 			WHEN (NOT tp IS NULL) THEN
						(
							CASE
								WHEN (NOT (tp."json" ->> 'unlimitedEndAt')::timestamptz IS NULL) THEN
									(
										CASE
											WHEN (NOW() > (tp."json" ->> 'unlimitedEndAt')::timestamptz) THEN
												$20
											ELSE $21
										END
									)
								ELSE $20
							END
						)
					WHEN ((NOT lt."endAt" IS NULL) AND (NOW() > lt."endAt")) THEN
						$4
					WHEN ((lt."type" = $27 OR lt."type" = $19) AND (NOT tp IS NULL)) THEN
						$20
					ELSE $3
				END
			) AS "status",
			COALESCE(et."points", 0) AS "expPoints"
		FROM "loyalty_project" AS lp
			RIGHT JOIN "loyalty_task" AS lt ON lt."loyaltyProjectId"=lp."id"
			LEFT JOIN "experience_task" AS et ON lt."experienceTaskId" = et."id"
			LEFT JOIN "task_progress" AS tp ON tp."loyaltyTaskId"=lt."id" AND tp."investorId"=$2
			LEFT JOIN "dailyTaskBodies" AS dtb ON lt."id"=dtb."loyaltyTaskId"
	        LEFT JOIN "localizedTasksData" AS ltd ON ltd."id"=lt."id"
		WHERE lp."linkTitle"=$1
	),
	"loyaltyTasks" AS (
		SELECT
			lp."id" AS "loyaltyProjectId",
			(
				CASE
					WHEN (COUNT(td."id")=0) THEN '[]'::jsonb
					ELSE
						jsonb_agg(
							jsonb_build_object(
								'id', td."id",
								'title', td."title",
								'points', td."points",
								'startAt', td."startAt",
								'endAt', td."endAt",
								'type', td."type",
								'sortOrder', td."sortOrder",
								'required', td."required",
								'isOnboardingTask', td."isOnboardingTask",
								'body', td."body",
								'status', td."status",
								'expPoints', td."expPoints",
                'sortOrder', td."sortOrder"
              ) ORDER BY td."sortOrder"
						)
				END
			) AS "loyaltyTasks"
		FROM "loyalty_project" AS lp
			LEFT JOIN "tasksData" AS td ON lp."id"=td."loyaltyProjectId"
		WHERE lp."linkTitle"=$1
		GROUP BY lp."id"
	),
	"resultTokens" AS (
	   	SELECT
			lr."loyaltyProjectId" AS "loyaltyProjectId",
			t."symbol" AS "symbol",
			t."logo" AS "logo",
			(CASE
	 			WHEN lp."projectType"=$22 THEN CEIL(SUM(lr."amount" * (lr."endPlace" - lr."startPlace" + 1)))
	   	 		ELSE CEIL(SUM(lr."amount"))
			 END) AS "amount"
		FROM "loyalty_reward" AS lr
			LEFT JOIN "contract" AS t ON lr."contractId"=t."id"
			LEFT JOIN "loyalty_project" AS lp ON lr."loyaltyProjectId"=lp."id"
		WHERE lp."linkTitle"=$1 AND lr."verified"=TRUE
		GROUP BY
			lr."loyaltyProjectId",
			lr."contractId",
			t."symbol",
			t."logo",
			lp."projectType"
	),
	"resultRewards" AS (
	   	SELECT
    		"resultTokens"."loyaltyProjectId" AS "loyaltyProjectId",
    		jsonb_agg(
   				jsonb_build_object(
   					'symbol', "resultTokens"."symbol",
   					'logo', "resultTokens"."logo",
   					'amount', "resultTokens"."amount"
   				)
   			) AS "rewards"
   		FROM "resultTokens"
   		WHERE "resultTokens"."amount">0
   		GROUP BY "resultTokens"."loyaltyProjectId"
	),
	"resultLoyaltyProject" AS (
	   	SELECT
	   		lp."id" AS "id",
			lp."questStatus" AS "questStatus",
	   		jsonb_agg(
				jsonb_build_object(
	   				'logo', pp."logo",
	   				'verificationIcon', pp."verificationIcon",
	   				'name', pp."name",
	   				'linkTitle', pp."linkTitle"
	   			)
	    	) AS "partnerProjects",
	    	(
	   		 CASE
	   	    	WHEN lp."startAt" IS NULL OR lp."startAt" > NOW() THEN $23
	   		    WHEN lp."endAt" <= NOW() THEN $24
				WHEN NULL::integer IS NULL THEN $26
	   		    WHEN EXISTS (
	   			      SELECT 1
	   	    		  FROM "task_progress"
	   			      WHERE "task_progress"."loyaltyProjectId" = lp."id"
	   	    		    AND "task_progress"."investorId" = $2
	   			    ) THEN $25
	   	    	ELSE $26
	   		  END
	   		) AS "status",
	   		lp."startAt" AS "startAt",
	   		lp."endAt" AS "endAt",
			lp."claimingStartAt" AS "claimingStartAt",
			lp."claimingEndAt" AS "claimingEndAt",
	   		COALESCE(lp."title", lp."projectName") AS "title",
	   		(
				jsonb_build_object(
	   				'tokens', COALESCE(rr."rewards", '[]'::jsonb)
	   			)
	   		) AS "rewards",
	   		lp."linkTitle" AS "linkTitle",
	   		lp."projectType" AS "projectType",
			lp."description" AS "description",
			lp."socialDescription" AS "socialDescription",
	   		lp."preview_img" AS "preview_img",
	   		lp."sortOrder" AS "sortOrder",
			lp."eligibleUsersCount" AS "eligibleUsersCount",
			lp."threshold" AS "threshold",
	        lp."visible" AS "visible",
			lp."featured" AS "featured",
			(SELECT COUNT(DISTINCT tp."investorId")::int FROM "task_progress" AS tp WHERE tp."loyaltyProjectId"=lp."id") AS "participants",
			"loyaltyTasks"."loyaltyTasks" AS "loyaltyTasks"
	    FROM "loyalty_project" AS lp
	   		INNER JOIN "loyalty_project_partner_projects_partner_project" AS lppp ON lp."id"=lppp."loyaltyProjectId"
	   		LEFT JOIN "partner_project" AS pp ON lppp."partnerProjectId"=pp."id"
	   		LEFT JOIN "resultRewards" AS rr ON rr."loyaltyProjectId"=lp."id"
			LEFT JOIN "loyaltyTasks" ON "loyaltyTasks"."loyaltyProjectId"=lp."id"
		WHERE lp."linkTitle"=$1
	   	GROUP BY lp."id", rr."rewards", "loyaltyTasks"."loyaltyTasks"
	)
	  SELECT
	  	rlp."id",
		rlp."linkTitle",
		rlp."title",
	   	rlp."partnerProjects",
	   	rlp."status",
		rlp."projectType",
		rlp."rewards",
	   	rlp."startAt",
	   	rlp."endAt",
		rlp."claimingStartAt",
	   	rlp."claimingEndAt",
	   	rlp."description",
	   	rlp."socialDescription",
	   	rlp."loyaltyTasks",
		rlp."preview_img",
		rlp."eligibleUsersCount",
		rlp."threshold",
		rlp."participants",
		rlp."questStatus"
	FROM "resultLoyaltyProject" AS rlp
`;
