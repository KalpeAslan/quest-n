import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeCascadeForInvestorAndRewards1697609891417 implements MigrationInterface {
  name = 'removeCascadeForInvestorAndRewards1697609891417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_reward" DROP CONSTRAINT "FK_320a322019dc700265117806a9e"`);
    await queryRunner.query(
      `ALTER TABLE "loyalty_reward" ADD CONSTRAINT "FK_investor_loyalty_reward_no_delete" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE SET NULL ON UPDATE NO ACTION;`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_1a696776d2fd23b72c88c9e13e2" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE SET NULL ON UPDATE NO ACTION;`,
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty_reward" ADD CONSTRAINT "FK_2ad717a54f3f7ff827cc71e654e" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_1a696776d2fd23b72c88c9e13e2"`);
    await queryRunner.query(`ALTER TABLE "loyalty_reward" DROP CONSTRAINT "FK_investor_loyalty_reward_no_delete"`);
    await queryRunner.query(`ALTER TABLE "loyalty_reward" DROP CONSTRAINT "FK_2ad717a54f3f7ff827cc71e654e"`);
  }
}
