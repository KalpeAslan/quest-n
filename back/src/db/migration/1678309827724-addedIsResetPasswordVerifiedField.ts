import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedIsResetPasswordVerifiedField1678309827724 implements MigrationInterface {
  name = 'addedIsResetPasswordVerifiedField1678309827724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "email_user" ADD "isResetPasswordVerified" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "email_user" DROP COLUMN "isResetPasswordVerified"`);
  }
}
