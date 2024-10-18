import {MigrationInterface, QueryRunner} from "typeorm";

export class addSale1649178833281 implements MigrationInterface {
    name = 'addSale1649178833281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deploy_history" DROP CONSTRAINT "FK_f901b3e4b2ec8a7292acf27035f"`);
        await queryRunner.query(`ALTER TABLE "deploy_history" RENAME COLUMN "projectId" TO "saleId"`);
        await queryRunner.query(`CREATE TABLE "sale" ("id" SERIAL NOT NULL, "tokenHolder" character varying NOT NULL DEFAULT '', "totalSupply" integer NOT NULL, "headImage" character varying NOT NULL, "hardCap" numeric, "vesting" jsonb NOT NULL DEFAULT '[100,0]', "minAllocation" numeric NOT NULL, "maxAllocation" numeric NOT NULL, "pricePerToken" numeric NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "projectId" integer NOT NULL, CONSTRAINT "PK_d03891c457cbcd22974732b5de2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "totalSupply"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "creatorName"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "hardCap"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "raised"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "accessType"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "minAllocation"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "maxAllocation"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "tierCondition"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "vesting"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "pricePerToken"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "tokenHolder"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "network" character varying NOT NULL DEFAULT 'ETH'`);
        await queryRunner.query(`ALTER TABLE "deploy_history" ADD CONSTRAINT "FK_5f07d3f46b75b2536fe8eb323bd" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale" ADD CONSTRAINT "FK_2b21749e4a6f9d9ea251dfaafd2" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_2b21749e4a6f9d9ea251dfaafd2"`);
        await queryRunner.query(`ALTER TABLE "deploy_history" DROP CONSTRAINT "FK_5f07d3f46b75b2536fe8eb323bd"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "network"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "tokenHolder" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "project" ADD "pricePerToken" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "project" ADD "vesting" jsonb NOT NULL DEFAULT '[100, 0]'`);
        await queryRunner.query(`ALTER TABLE "project" ADD "tierCondition" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "maxAllocation" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "minAllocation" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "accessType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "raised" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "project" ADD "hardCap" numeric`);
        await queryRunner.query(`ALTER TABLE "project" ADD "creatorName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "totalSupply" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "sale"`);
        await queryRunner.query(`ALTER TABLE "deploy_history" RENAME COLUMN "saleId" TO "projectId"`);
        await queryRunner.query(`ALTER TABLE "deploy_history" ADD CONSTRAINT "FK_f901b3e4b2ec8a7292acf27035f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
