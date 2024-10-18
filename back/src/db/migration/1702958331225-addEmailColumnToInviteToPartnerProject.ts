import { MigrationInterface, QueryRunner } from 'typeorm';

export class addEmailColumnToInviteToPartnerProject1702958331225 implements MigrationInterface {
  name = 'addEmailColumnToInviteToPartnerProject1702958331225';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invites_to_partner_project" ADD "email" character varying NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "invites_to_partner_project" DROP CONSTRAINT "FK_5f168969bfd5537398d3c56734b"`,
    );
    await queryRunner.query(`ALTER TABLE "invites_to_partner_project" ALTER COLUMN "investorId" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "invites_to_partner_project" ADD CONSTRAINT "FK_5f168969bfd5537398d3c56734b" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invites_to_partner_project" DROP CONSTRAINT "FK_5f168969bfd5537398d3c56734b"`,
    );

    await queryRunner.query(`ALTER TABLE "invites_to_partner_project" ALTER COLUMN "investorId" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "invites_to_partner_project" ADD CONSTRAINT "FK_5f168969bfd5537398d3c56734b" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "invites_to_partner_project" DROP COLUMN "email"`);
  }
}
