import { MigrationInterface, QueryRunner } from 'typeorm';

export class addContractDecimals1695125183684 implements MigrationInterface {
  name = 'addContractDecimals1695125183684';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contract" ADD "decimals" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "decimals"`);
  }
}
