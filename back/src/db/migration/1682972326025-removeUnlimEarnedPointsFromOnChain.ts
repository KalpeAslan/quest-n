import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeUnlimEarnedPointsFromOnChain1682972326025 implements MigrationInterface {
  name = 'removeUnlimEarnedPointsFromOnChain1682972326025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quest_completed_on_chain_tasks" DROP COLUMN "unlimitedEarnedPoints"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quest_completed_on_chain_tasks" ADD "unlimitedEarnedPoints" numeric`);
  }
}
