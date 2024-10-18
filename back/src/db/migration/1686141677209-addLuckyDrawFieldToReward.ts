import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLuckyDrawFieldToReward1686141677209 implements MigrationInterface {
  name = 'AddLuckyDrawFieldToReward1686141677209';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loyalty_project" ALTER COLUMN "body" SET DEFAULT '{"scoreboardRewards":{"rewards":[],"minTokenAmount":0},"luckyDrawRewards":{"luckyDrawThreshold": 0,"rewards":[],"minTokenAmount":0,"eligibleUsersCount":0}}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loyalty_project" ALTER COLUMN "body" SET DEFAULT '{"minTokenAmount": 0, "scoreboardRewards": []}'`,
    );
  }
}
