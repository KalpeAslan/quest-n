import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTgUserTempCode1700564726501 implements MigrationInterface {
  name = 'addTgUserTempCode1700564726501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "telegram_user" ADD "tempCode" character varying DEFAULT NULL`);
    await queryRunner.query(
      `ALTER TABLE "telegram_user" ADD CONSTRAINT "UQ_6940cf0913bbed187d4f59ba666" UNIQUE ("tempCode")`,
    );
    await queryRunner.query(`ALTER TABLE "telegram_user" ALTER COLUMN "telegramId" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "telegram_user" ALTER COLUMN "telegramId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "telegram_user" DROP CONSTRAINT "UQ_6940cf0913bbed187d4f59ba666"`);
    await queryRunner.query(`ALTER TABLE "telegram_user" DROP COLUMN "tempCode"`);
  }
}
