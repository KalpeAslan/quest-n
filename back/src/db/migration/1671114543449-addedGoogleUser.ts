import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedGoogleUser1671114543449 implements MigrationInterface {
  name = 'addedGoogleUser1671114543449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "google_user" ("id" SERIAL NOT NULL, "googleId" character varying NOT NULL, "googleUsername" character varying NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "investorId" integer NOT NULL, CONSTRAINT "REL_cf95fe5995ab52157612b6fd98" UNIQUE ("investorId"), CONSTRAINT "PK_327db3e0d20823d96ed80889431" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "google_user" ADD CONSTRAINT "FK_cf95fe5995ab52157612b6fd988" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "google_user" DROP CONSTRAINT "FK_cf95fe5995ab52157612b6fd988"`);
    await queryRunner.query(`DROP TABLE "google_user"`);
  }
}
