import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrateGuranteedTreshold1690452685200 implements MigrationInterface {
  name = 'migrateGuranteedTreshold1690452685200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "loyalty_project"
        SET
          "threshold" = CASE
            WHEN "projectType" = 'guaranteed' THEN CAST("body"->'guaranteedRewards'->'guaranteedThreshold' AS integer)
    END;`);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
