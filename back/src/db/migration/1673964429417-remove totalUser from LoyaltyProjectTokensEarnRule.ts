import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeTotalUserFromLoyaltyProjectTokensEarnRule1673964429417 implements MigrationInterface {
  name = 'removeTotalUserFromLoyaltyProjectTokensEarnRule1673964429417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loyalty_project_tokens_earn_rule" DROP CONSTRAINT "UQ_f03099e9f664ebbc2eaa100890f"`,
    );
    await queryRunner.query(`ALTER TABLE "loyalty_project_tokens_earn_rule" DROP COLUMN "totalUsers"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project_tokens_earn_rule" DROP COLUMN "rules"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project_tokens_earn_rule" ADD "startPlace" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project_tokens_earn_rule" ADD "endPlace" numeric NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project_tokens_earn_rule" ADD "profit" numeric NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project_tokens_earn_rule" DROP COLUMN "profit"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project_tokens_earn_rule" DROP COLUMN "endPlace"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project_tokens_earn_rule" DROP COLUMN "startPlace"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project_tokens_earn_rule" ADD "rules" jsonb NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project_tokens_earn_rule" ADD "totalUsers" numeric NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "loyalty_project_tokens_earn_rule" ADD CONSTRAINT "UQ_f03099e9f664ebbc2eaa100890f" UNIQUE ("totalUsers")`,
    );
  }
}
