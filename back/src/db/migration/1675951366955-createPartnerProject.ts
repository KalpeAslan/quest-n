import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPartnerProject1675951366955 implements MigrationInterface {
  name = 'createPartnerProject1675951366955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partner_project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "logo" character varying NOT NULL, "verificationIcon" boolean NOT NULL DEFAULT true, "media" jsonb NOT NULL, CONSTRAINT "PK_da87f40efce0efc98277809349b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "loyalty_project_partner_projects_partner_project" ("loyaltyProjectId" integer NOT NULL, "partnerProjectId" integer NOT NULL, CONSTRAINT "PK_129d9367faa65813f954b87274a" PRIMARY KEY ("loyaltyProjectId", "partnerProjectId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a1fbaa68759174f3508beb6de9" ON "loyalty_project_partner_projects_partner_project" ("loyaltyProjectId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a0b434f05d512bf60c8ebaa631" ON "loyalty_project_partner_projects_partner_project" ("partnerProjectId") `,
    );
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "claimingStartAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "claimingEndAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "shortDescription" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "backgroundImage" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "previewImage" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "loyalty_project_partner_projects_partner_project" ADD CONSTRAINT "FK_a1fbaa68759174f3508beb6de9c" FOREIGN KEY ("loyaltyProjectId") REFERENCES "loyalty_project"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty_project_partner_projects_partner_project" ADD CONSTRAINT "FK_a0b434f05d512bf60c8ebaa631b" FOREIGN KEY ("partnerProjectId") REFERENCES "partner_project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loyalty_project_partner_projects_partner_project" DROP CONSTRAINT "FK_a0b434f05d512bf60c8ebaa631b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty_project_partner_projects_partner_project" DROP CONSTRAINT "FK_a1fbaa68759174f3508beb6de9c"`,
    );
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "previewImage" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "backgroundImage" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "shortDescription" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "claimingEndAt"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "claimingStartAt"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a0b434f05d512bf60c8ebaa631"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a1fbaa68759174f3508beb6de9"`);
    await queryRunner.query(`DROP TABLE "loyalty_project_partner_projects_partner_project"`);
    await queryRunner.query(`DROP TABLE "partner_project"`);
  }
}
