import { MigrationInterface, QueryRunner } from 'typeorm';

export class changedTwitterTokenTable1665669426402 implements MigrationInterface {
  name = 'changedTwitterTokenTable1665669426402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE twitter_token`);
    await queryRunner.query(`ALTER TABLE "twitter_token" DROP COLUMN "accessToken"`);
    await queryRunner.query(`ALTER TABLE "twitter_token" DROP COLUMN "refreshToken"`);
    await queryRunner.query(`ALTER TABLE "twitter_token" DROP COLUMN "expiredIn"`);
    await queryRunner.query(`ALTER TABLE "twitter_token" ADD "oauthAccessToken" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "twitter_token" ADD "oauthAccessTokenSecret" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE twitter_token`);
    await queryRunner.query(`ALTER TABLE "twitter_token" DROP COLUMN "oauthAccessTokenSecret"`);
    await queryRunner.query(`ALTER TABLE "twitter_token" DROP COLUMN "oauthAccessToken"`);
    await queryRunner.query(`ALTER TABLE "twitter_token" ADD "expiredIn" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "twitter_token" ADD "refreshToken" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "twitter_token" ADD "accessToken" character varying NOT NULL`);
  }
}
