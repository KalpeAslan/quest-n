import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPartnerProjectCreator1683542814465 implements MigrationInterface {
  name = 'addPartnerProjectCreator1683542814465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_project" ADD "investorId" integer`);
    await queryRunner.query(
      `ALTER TABLE "partner_project" ADD CONSTRAINT "FK_85b16e995e5348c331cb90311ee" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partner_project" DROP CONSTRAINT "FK_85b16e995e5348c331cb90311ee"`);
    await queryRunner.query(`ALTER TABLE "partner_project" DROP COLUMN "investorId"`);
  }
}
