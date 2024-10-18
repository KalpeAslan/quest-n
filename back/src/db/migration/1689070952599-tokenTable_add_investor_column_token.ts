import { MigrationInterface, QueryRunner } from 'typeorm';

export class TokenTableAddInvestorColumnToken1689070952599 implements MigrationInterface {
  name = 'TokenTableAddInvestorColumnToken1689070952599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" ADD "investorId" integer`);
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_8836350fe8f6b10103f2d812987" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_8836350fe8f6b10103f2d812987"`);
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "investorId"`);
  }
}
