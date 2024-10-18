import { MigrationInterface, QueryRunner } from 'typeorm';

export class createNftTable1693906822511 implements MigrationInterface {
  name = 'createNftTable1693906822511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "nft" ("id" SERIAL NOT NULL, "nftId" numeric, "image" character varying, "name" character varying, "contractId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1156642d40093c2cf27efc405a5" UNIQUE ("nftId"), CONSTRAINT "PK_8f46897c58e23b0e7bf6c8e56b0" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "nft"`);
  }
}
