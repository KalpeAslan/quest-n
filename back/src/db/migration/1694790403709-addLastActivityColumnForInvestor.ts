import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLastActivityColumnForInvestor1694790403709 implements MigrationInterface {
  name = 'addLastActivityColumnForInvestor1694790403709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" ADD "lastActivity" TIMESTAMP NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "lastActivity"`);
  }
}
