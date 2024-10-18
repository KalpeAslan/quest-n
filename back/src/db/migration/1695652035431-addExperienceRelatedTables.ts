import { MigrationInterface, QueryRunner } from 'typeorm';

export class addExperienceRelatedTables1695652035431 implements MigrationInterface {
  name = 'addExperienceRelatedTables1695652035431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "experience" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "points" numeric NOT NULL, "body" jsonb NOT NULL DEFAULT '{}', "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ba0d17802d3d7a7410c52e97191" UNIQUE ("name"), CONSTRAINT "UQ_621db30afc04c91218ed4122d24" UNIQUE ("type"), CONSTRAINT "PK_5e8d5a534100e1b17ee2efa429a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "experience_level" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "pointsFrom" numeric NOT NULL, "pointsTo" numeric NOT NULL, "level" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1708679e6ca1e251f1109fa737c" UNIQUE ("name"), CONSTRAINT "PK_b77747e25c4d85f36e902fa53f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "experience_progress" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "earnedPoints" numeric NOT NULL, "body" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "experienceId" integer NOT NULL, "investorId" integer NOT NULL, CONSTRAINT "PK_85a112b477597216890bcdfedbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "experience_progress" ADD CONSTRAINT "FK_b8339593bfe70b542aa57b53c55" FOREIGN KEY ("experienceId") REFERENCES "experience"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "experience_progress" ADD CONSTRAINT "FK_b9390436a6a7069339770332c89" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_progress" DROP CONSTRAINT "FK_b9390436a6a7069339770332c89"`);
    await queryRunner.query(`ALTER TABLE "experience_progress" DROP CONSTRAINT "FK_b8339593bfe70b542aa57b53c55"`);
    await queryRunner.query(`DROP TABLE "experience_progress"`);
    await queryRunner.query(`DROP TABLE "experience_level"`);
    await queryRunner.query(`DROP TABLE "experience"`);
  }
}
