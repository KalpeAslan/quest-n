import { MigrationInterface, QueryRunner } from 'typeorm';

export class dropColumnIsResetPassword1697792055804 implements MigrationInterface {
  name = 'dropColumnIsResetPassword1697792055804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "email_user" DROP COLUMN "isResetPasswordVerified"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "email_user" ADD COLUMN "isResetPasswordVerified" BOOLEAN DEFAULT FALSE;`);
  }
}
