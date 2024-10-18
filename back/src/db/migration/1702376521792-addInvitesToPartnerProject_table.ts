import { MigrationInterface, QueryRunner } from 'typeorm';

export class addInvitesToPartnerProjectTable1702376521792 implements MigrationInterface {
  name = 'addInvitesToPartnerProjectTable1702376521792';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invites_to_partner_project" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "partnerProjectId" integer NOT NULL, "investorId" integer NOT NULL, CONSTRAINT "PK_46db6330653bd6fb495809ad7f3" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "invites_to_partner_project" ADD CONSTRAINT "FK_d63c549097da7780f1eb345eb1f" FOREIGN KEY ("partnerProjectId") REFERENCES "partner_project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites_to_partner_project" ADD CONSTRAINT "FK_5f168969bfd5537398d3c56734b" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invites_to_partner_project" DROP CONSTRAINT "FK_5f168969bfd5537398d3c56734b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites_to_partner_project" DROP CONSTRAINT "FK_d63c549097da7780f1eb345eb1f"`,
    );
    await queryRunner.query(`DROP TABLE "invites_to_partner_project"`);
  }
}
