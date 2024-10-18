export namespace InvestorQueries {
  export const getWithRecentActivity = (investorIDs: number[]) => `
    SELECT *
    FROM investor
    WHERE id IN (${investorIDs.join(',')})
    AND lastActivity >= $1;
  `;

  export const getLevelByInvestorId = (investorId: number) => `
    WITH EarnedPoints AS (
      SELECT SUM(ep."earnedPoints") AS totalPoints
      FROM experience_progress ep
      WHERE ep."investorId" = ${investorId}
    )
    
    SELECT el.*
    FROM experience_level el
    LEFT JOIN EarnedPoints ep ON ep.totalPoints BETWEEN el."pointsFrom" AND el."pointsTo"
    WHERE ep.totalPoints IS NOT NULL
      OR el."pointsTo" = (SELECT MIN("pointsTo") FROM experience_level)
    LIMIT 1;
  `;
}
