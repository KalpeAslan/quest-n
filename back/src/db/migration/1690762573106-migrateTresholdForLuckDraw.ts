import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrateTresholdForLuckDraw1690762573106 implements MigrationInterface {
  name = 'migrateTresholdForLuckDraw1690762573106';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "loyalty_project"
    SET
      "threshold" = CASE
        WHEN "projectType" = 'luckyDraw' THEN CAST("body"->'luckyDrawRewards'->'luckyDrawThreshold' AS integer)
END;`);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
