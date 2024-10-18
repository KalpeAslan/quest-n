import { MigrationInterface, QueryRunner } from 'typeorm';

export class setRewardsVerifiedAndClaimDates1697636326228 implements MigrationInterface {
  name = 'setRewardsVerifiedAndClaimDates1697636326228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "loyalty_reward" SET verified = True;`);
    await queryRunner.query(`UPDATE "loyalty_project" SET "claimingEndAt" = (
        CASE
	        WHEN "claimingEndAt" <= (NOW() - INTERVAL '1 day') THEN "claimingEndAt"
	        ELSE (NOW() - INTERVAL '1 day')
        END
    );`);
  }

  public async down(): Promise<void> {
    console.log('Unable to revert');
  }
}
