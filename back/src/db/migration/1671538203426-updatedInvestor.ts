import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatedInvestor1671538203426 implements MigrationInterface {
  name = 'updatedInvestor1671538203426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "telegram_user" ADD "telegramUsername" character varying`);
    await queryRunner.query(`ALTER TABLE "twitter_token" ADD "twitterUsername" character varying`);
    await queryRunner.query(`ALTER TABLE "discord_token" ADD "discordUsername" character varying`);
    await queryRunner.query(`ALTER TABLE "investor" ADD "username" character varying`);
    await queryRunner.query(
      `ALTER TABLE "investor" ADD CONSTRAINT "UQ_bc6c98c2590934aee6859bf3a28" UNIQUE ("username")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" DROP CONSTRAINT "UQ_bc6c98c2590934aee6859bf3a28"`);
    await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "username"`);
    await queryRunner.query(`ALTER TABLE "discord_token" DROP COLUMN "discordUsername"`);
    await queryRunner.query(`ALTER TABLE "twitter_token" DROP COLUMN "twitterUsername"`);
    await queryRunner.query(`ALTER TABLE "telegram_user" DROP COLUMN "telegramUsername"`);
  }
}
