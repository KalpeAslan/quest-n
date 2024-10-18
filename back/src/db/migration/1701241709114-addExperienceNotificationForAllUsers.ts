import { MigrationInterface, QueryRunner } from 'typeorm';

export class addExperienceNotificationForAllUsers1701241709114 implements MigrationInterface {
  name = 'addExperienceNotificationForAllUsers1701241709114';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO notification (title, "type", "investorId", payload, "createdAt")
       SELECT
         'Get experience points',
         'experience',
         i.id AS investorId,
         '{"message": "We launched a new experience system!"}'::jsonb AS payload,
         NOW() AS createdAt
       FROM
         Investor i
           LEFT JOIN
         notification n ON i.id = n."investorId" AND n.type = 'experience'
       WHERE
         n.id IS NULL;
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM notification WHERE "type" = 'experience'`);
  }
}
