import {MigrationInterface, QueryRunner} from "typeorm";

export class addEmail1645196013570 implements MigrationInterface {
    name = 'addEmail1645196013570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_subscription" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fbfd28125a35bcee99ea58f1edb" UNIQUE ("email"), CONSTRAINT "PK_3fab89deebd0355252568c36d0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project" ADD "shortDescription" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "previewImage" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "previewImage"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "shortDescription"`);
        await queryRunner.query(`DROP TABLE "email_subscription"`);
    }

}
