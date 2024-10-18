import { MigrationInterface, QueryRunner } from 'typeorm';

export class createLoyaltyProject1662451992433 implements MigrationInterface {
  name = 'createLoyaltyProject1662451992433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "loyalty_project" ("id" SERIAL NOT NULL, "linkTitle" character varying, "shortDescription" character varying NOT NULL, "projectName" character varying NOT NULL, "backgroundImage" character varying NOT NULL, "avatar" character varying NOT NULL, "previewImage" character varying NOT NULL, "media" jsonb NOT NULL, "projectDescription" character varying NOT NULL DEFAULT '', "startAt" TIMESTAMP, "endAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_d3092ed7c1234ce3f263206cb5e" UNIQUE ("linkTitle"), CONSTRAINT "PK_2ef1db93b94ca6575ea2df5dda6" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "loyalty_project"`);
  }
}
