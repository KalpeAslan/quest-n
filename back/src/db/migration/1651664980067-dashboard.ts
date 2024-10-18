import {MigrationInterface, QueryRunner} from "typeorm";

export class dashboard1651664980067 implements MigrationInterface {
    name = 'dashboard1651664980067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "investor" ("id" SERIAL NOT NULL, "wallet" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9aa2bdade1ab1f41ecbed58bd84" UNIQUE ("wallet"), CONSTRAINT "PK_c60a173349549955c39d3703551" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "participation" ("id" SERIAL NOT NULL, "boughtAllocation" numeric NOT NULL, "claimedAllocation" numeric NOT NULL, "saleId" integer NOT NULL, "investorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba5442bab90fc96ddde456c69e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0a493aaf87511dfdc3220389ef" ON "participation" ("saleId", "investorId") `);
        await queryRunner.query(`ALTER TABLE "sale" ADD "handled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "project" ADD "tokenDecimals" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "project" ADD "projectCurrencyDecimals" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "participation" ADD CONSTRAINT "FK_f308cb0b3a7472b2bfc61c7b555" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participation" ADD CONSTRAINT "FK_312794cb4d910fa6c7697f15382" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participation" DROP CONSTRAINT "FK_312794cb4d910fa6c7697f15382"`);
        await queryRunner.query(`ALTER TABLE "participation" DROP CONSTRAINT "FK_f308cb0b3a7472b2bfc61c7b555"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "projectCurrencyDecimals"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "tokenDecimals"`);
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "handled"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0a493aaf87511dfdc3220389ef"`);
        await queryRunner.query(`DROP TABLE "participation"`);
        await queryRunner.query(`DROP TABLE "investor"`);
    }

}
