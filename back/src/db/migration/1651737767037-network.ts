import { MigrationInterface, QueryRunner } from 'typeorm';

export class network1651737767037 implements MigrationInterface {
  name = 'network1651737767037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "network" ("id" SERIAL NOT NULL, "networkName" character varying NOT NULL, "chainId" numeric NOT NULL DEFAULT '0', "icon" character varying NOT NULL, "rpcUrl" character varying NOT NULL, "blockExplorer" character varying NOT NULL, "currencySymbol" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8f8264c2d37cbbd8282ee9a3c97" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "network"`);
  }
}
