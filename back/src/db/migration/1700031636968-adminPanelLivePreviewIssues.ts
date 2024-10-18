import { MigrationInterface, QueryRunner } from 'typeorm';

export class adminPanelLivePreviewIssues1700031636968 implements MigrationInterface {
  name = 'adminPanelLivePreviewIssues1700031636968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO notification (title, "type", "investorId", payload, "createdAt")
SELECT
    'Complete onboarding quest',
    'onBoarding',
    i.id AS investorId,
    jsonb_set(
            '{"message": "Complete onboarding quest to start earning experience"}'::jsonb,
            '{questLinkTitle}',
            to_jsonb(
                    (
                        SELECT lp."linkTitle"
                        FROM loyalty_task lt
                                 LEFT JOIN loyalty_project lp ON lt."loyaltyProjectId" = lp.id
                        WHERE lt.type = 'signUp'
                        LIMIT 1
                    )::text
                )
        ) AS payload,
    NOW() AS createdAt
FROM
    Investor i
        LEFT JOIN
    notification n ON i.id = n."investorId" AND n.type = 'onBoarding'
WHERE
    n.id IS NULL
`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
