import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedIsVerifiedToContract1694671043380 implements MigrationInterface {
  name = 'addedIsVerifiedToContract1694671043380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contract" ADD "isVerified" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "isVerified"`);
  }
}
