import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedAuthTokenTable1656937138464 implements MigrationInterface {
  name = 'addedAuthTokenTable1656937138464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_token" ("id" SERIAL NOT NULL, "token" character varying(48) NOT NULL, "activedTo" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7a74281711d1a581b4dcc4d59ff" UNIQUE ("token"), CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "auth_token"`);
  }
}
