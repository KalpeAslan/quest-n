import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrateTresholdAndCountIntoColumns1689925979606 implements MigrationInterface {
  name = 'migrateTresholdAndCountIntoColumns1689925979606';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "loyalty_project"
    SET
      "threshold" = CASE
                      WHEN "projectType" = 'luckyDraw' THEN CAST("body"->'luckyDrawRewards'->'luckyDrawThreshold' AS integer)
                      ELSE NULL
                    END,
      "eligibleUsersCount" = CASE
                              WHEN "projectType" = 'luckyDraw' THEN CAST("body"->'luckyDrawRewards'->>'eligibleUsersCount' AS integer)
                              ELSE NULL
                            END;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
