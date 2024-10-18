import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeCascadeDeleteFromReferralInfo1673618207011 implements MigrationInterface {
  name = 'removeCascadeDeleteFromReferralInfo1673618207011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "referral_info" DROP CONSTRAINT "FK_781930048dc1170af50883be738"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "referral_info" ADD CONSTRAINT "FK_781930048dc1170af50883be738" FOREIGN KEY ("referralRanksRuleId") REFERENCES "referral_ranks_rule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
