import { MigrationInterface, QueryRunner } from 'typeorm';

export class addInvestorGamesSessions1686752320318 implements MigrationInterface {
  name = 'addInvestorGamesSessions1686752320318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" ADD "gamesSessions" jsonb NOT NULL DEFAULT '[]'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "gamesSessions"`);
  }
}
