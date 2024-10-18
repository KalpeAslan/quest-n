import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPartnerProjectInvestorIdOnDeleteSetNull1684926125831 implements MigrationInterface {
  name = 'addPartnerProjectInvestorIdOnDeleteSetNull1684926125831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_project" DROP CONSTRAINT "FK_85b16e995e5348c331cb90311ee"`);
    await queryRunner.query(
      `ALTER TABLE "partner_project" ADD CONSTRAINT "FK_85b16e995e5348c331cb90311ee" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_project" DROP CONSTRAINT "FK_85b16e995e5348c331cb90311ee"`);
    await queryRunner.query(
      `ALTER TABLE "partner_project" ADD CONSTRAINT "FK_85b16e995e5348c331cb90311ee" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
