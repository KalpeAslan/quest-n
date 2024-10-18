import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameTokenToContract1693907380538 implements MigrationInterface {
  name = 'renameTokenToContract1693907380538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" RENAME TO "contract";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contract" RENAME TO "token";`);
  }
}
