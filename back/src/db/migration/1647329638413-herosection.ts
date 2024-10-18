import {MigrationInterface, QueryRunner} from "typeorm";

export class herosection1647329638413 implements MigrationInterface {
    name = 'herosection1647329638413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hero_section" ("id" SERIAL NOT NULL, "image" character varying NOT NULL, "description" character varying NOT NULL, "status" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer NOT NULL, CONSTRAINT "REL_2c0c32f0f4e7515b03aba3e09c" UNIQUE ("projectId"), CONSTRAINT "PK_9e3a0a6b26e7a0b0022f1b7dccc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project" ADD "participateButton" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "hero_section" ADD CONSTRAINT "FK_2c0c32f0f4e7515b03aba3e09c7" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hero_section" DROP CONSTRAINT "FK_2c0c32f0f4e7515b03aba3e09c7"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "participateButton"`);
        await queryRunner.query(`DROP TABLE "hero_section"`);
    }

}
