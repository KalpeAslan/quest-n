import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatedNetworkEntity1661947793525 implements MigrationInterface {
  name = 'updatedNetworkEntity1661947793525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "network" RENAME "networkName" to "name"');
    await queryRunner.query('ALTER TABLE "network" RENAME "blockExplorer" to "blockExplorerUrl"');
    await queryRunner.query(`ALTER TABLE "network" ADD "blockExplorerName" character varying`);
    await queryRunner.query(`ALTER TABLE "network" ADD "currencyDecimals" numeric`);
    await queryRunner.query(`ALTER TABLE "network" ADD "currencyName" character varying`);
    await queryRunner.query(`ALTER TABLE "network" ADD "isTestNet" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "network" RENAME "name" to "networkName"');
    await queryRunner.query('ALTER TABLE "network" RENAME "blockExplorerUrl" to "blockExplorer"');
    await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "isTestNet"`);
    await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "currencyName"`);
    await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "currencyDecimals"`);
    await queryRunner.query(`ALTER TABLE "network" DROP COLUMN "blockExplorerName"`);
  }
}
