import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOnchainTransactionsHistory1696612530902 implements MigrationInterface {
  name = 'addOnchainTransactionsHistory1696612530902';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "onchain_transactions_history" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "loyaltyRewardId" integer NOT NULL, "investorId" integer NOT NULL, "tokenIds" jsonb NOT NULL DEFAULT '[]', "transactionHash" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_789c8556114c69fedb5a6564ccb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" ADD CONSTRAINT "FK_63b8ffa1494cb7aba1baeca7905" FOREIGN KEY ("loyaltyRewardId") REFERENCES "loyalty_reward"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" ADD CONSTRAINT "FK_3cb87fc89f35a480bf8859f38d0" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" DROP CONSTRAINT "FK_3cb87fc89f35a480bf8859f38d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onchain_transactions_history" DROP CONSTRAINT "FK_63b8ffa1494cb7aba1baeca7905"`,
    );
    await queryRunner.query(`DROP TABLE "onchain_transactions_history"`);
  }
}
