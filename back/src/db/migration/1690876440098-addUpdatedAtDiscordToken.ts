import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUpdatedAtDiscordToken1690876440098 implements MigrationInterface {
  name = 'addUpdatedAtDiscordToken1690876440098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "discord_token" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "discord_token" DROP COLUMN "updatedAt"`);
  }
}
