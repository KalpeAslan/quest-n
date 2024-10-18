import {MigrationInterface, QueryRunner} from "typeorm";

export class init1645081931513 implements MigrationInterface {
    name = 'init1645081931513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "visible" boolean NOT NULL DEFAULT true, "projectName" character varying NOT NULL, "tokenSymbol" character varying NOT NULL, "projectType" character varying NOT NULL, "projectAddress" character varying NOT NULL, "tokenAddress" character varying, "totalSupply" integer NOT NULL, "backgroundImage" character varying NOT NULL, "avatar" character varying NOT NULL, "status" character varying NOT NULL, "subscribeStartAt" TIMESTAMP, "subscribeEndAt" TIMESTAMP, "creatorName" character varying NOT NULL, "media" jsonb NOT NULL, "projectDescription" character varying NOT NULL, "hardCap" numeric NOT NULL, "raised" numeric NOT NULL DEFAULT '0', "vesting" character varying NOT NULL, "projectCurrency" character varying NOT NULL, "accessType" character varying NOT NULL, "minAllocation" character varying NOT NULL, "maxAllocation" character varying NOT NULL, "projectStartAt" TIMESTAMP, "projectEndAt" TIMESTAMP, "tierCondition" jsonb NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
