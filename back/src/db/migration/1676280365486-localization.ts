import { MigrationInterface, QueryRunner } from 'typeorm';

export class localization1676280365486 implements MigrationInterface {
  name = 'localization1676280365486';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "localization" ("id" SERIAL NOT NULL, "body" character varying, "lang" character varying NOT NULL, "objId" character varying NOT NULL, "fieldType" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_660870960a68bff85eb121bfd8a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "loyalty_task" ADD "localizationId" character varying`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "localizationId" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "localizationId"`);
    await queryRunner.query(`ALTER TABLE "loyalty_task" DROP COLUMN "localizationId"`);
    await queryRunner.query(`DROP TABLE "localization"`);
  }
}
