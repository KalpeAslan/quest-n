import { MigrationInterface, QueryRunner } from 'typeorm';

export class onchainTransactionsHistoryOnDelete1697023658178 implements MigrationInterface {
  name = 'onchainTransactionsHistoryOnDelete1697023658178';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" DROP CONSTRAINT "FK_3cb87fc89f35a480bf8859f38d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" DROP CONSTRAINT "FK_63b8ffa1494cb7aba1baeca7905"`,
    );
    await queryRunner.query(`ALTER TABLE "onchain_transactions_history" ALTER COLUMN "investorId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" ADD CONSTRAINT "FK_63b8ffa1494cb7aba1baeca7905" FOREIGN KEY ("loyaltyRewardId") REFERENCES "loyalty_reward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" ADD CONSTRAINT "FK_3cb87fc89f35a480bf8859f38d0" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" DROP CONSTRAINT "FK_3cb87fc89f35a480bf8859f38d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" DROP CONSTRAINT "FK_63b8ffa1494cb7aba1baeca7905"`,
    );
    await queryRunner.query(`ALTER TABLE "onchain_transactions_history" ALTER COLUMN "investorId" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" ADD CONSTRAINT "FK_63b8ffa1494cb7aba1baeca7905" FOREIGN KEY ("loyaltyRewardId") REFERENCES "loyalty_reward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" ADD CONSTRAINT "FK_3cb87fc89f35a480bf8859f38d0" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
