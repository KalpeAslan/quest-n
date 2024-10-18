import {MigrationInterface, QueryRunner} from "typeorm";

export class addedPartnerTable1658238085645 implements MigrationInterface {
    name = 'addedPartnerTable1658238085645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "partner" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, "link" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, "priorityNumber" numeric NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8f34ff11ddd5459eacbfacd48ca" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "partner"`);
    }

}
