import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrateFromTwitterUserAndDelete1697441938219 implements MigrationInterface {
  name = 'migrateFromTwitterUserAndDelete1697441938219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO twitter_token ("createdAt", "investorId", "twitterId", "oauthAccessToken", "oauthAccessTokenSecret", "twitterUsername")
        SELECT tu."createdAt", tu."investorId", tu."twitterId", '', '', tu."twitterUsername"
        FROM twitter_user tu
        WHERE NOT EXISTS (
            SELECT 1
            FROM twitter_token tt
            WHERE tt."twitterId" = tu."twitterId" or tt."investorId" = tu."investorId"
        );
    `);

    await queryRunner.query(`
        DROP TABLE twitter_user;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No need to revert this migration
  }
}
