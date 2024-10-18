import { MigrationInterface, QueryRunner } from 'typeorm';

export class dropBodyColumnFromLoyaltyProject1691475920032 implements MigrationInterface {
  name = 'dropBodyColumnFromLoyaltyProject1691475920032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "body"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loyalty_project" ADD "body" jsonb NOT NULL DEFAULT '{"luckyDrawRewards": {"rewards": [], "minTokenAmount": 0, "eligibleUsersCount": 0, "luckyDrawThreshold": 0}, "scoreboardRewards": {"rewards": [], "minTokenAmount": 0}}'`,
    );
  }
}
