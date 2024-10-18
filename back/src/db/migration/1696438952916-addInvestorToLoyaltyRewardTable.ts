import { MigrationInterface, QueryRunner } from 'typeorm';

export class addInvestorToLoyaltyRewardTable1696438952916 implements MigrationInterface {
  name = 'addInvestorToLoyaltyRewardTable1696438952916';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_reward" ADD "investorId" integer`);
    await queryRunner.query(
      `ALTER TABLE "loyalty_reward" ADD CONSTRAINT "FK_320a322019dc700265117806a9e" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_reward" DROP COLUMN "investorId"`);
    await queryRunner.query(`ALTER TABLE "loyalty_reward" DROP CONSTRAINT "FK_320a322019dc700265117806a9e"`);
  }
}
