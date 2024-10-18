import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateContractsTable1693909965274 implements MigrationInterface {
  name = 'updateContractsTable1693909965274';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "token_standard_enum" AS ENUM('erc20', 'erc721', 'erc1155')`);
    await queryRunner.query(`ALTER TABLE "contract" ADD "chainId" character varying`);
    await queryRunner.query(`ALTER TABLE "contract" ADD "address" character varying`);
    await queryRunner.query(`ALTER TABLE "contract" ADD "standard" "token_standard_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "standard"`);
    await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "chainId"`);
    await queryRunner.query(`DROP TYPE "token_standard_enum"`);
  }
}
