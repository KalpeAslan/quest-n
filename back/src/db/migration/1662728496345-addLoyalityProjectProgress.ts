import {MigrationInterface, QueryRunner} from "typeorm";

export class addLoyalityProjectProgress1662728496345 implements MigrationInterface {
    name = 'addLoyalityProjectProgress1662728496345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "loyalty_project_progress" ("id" SERIAL NOT NULL, "earnedPoints" numeric NOT NULL DEFAULT '0', "loyaltyProjectId" integer NOT NULL, "investorId" integer NOT NULL, CONSTRAINT "PK_f81aba9d2c9b69a599303ac1fc6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "loy_tas_loy_pro_pro_loy_pro_pro" ("loyaltyTaskId" integer NOT NULL, "loyaltyProjectProgressId" integer NOT NULL, CONSTRAINT "PK_b5375cef08e649146c4706c62dc" PRIMARY KEY ("loyaltyTaskId", "loyaltyProjectProgressId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_90b073f3bd39f6aca1faecbfbf" ON "loy_tas_loy_pro_pro_loy_pro_pro" ("loyaltyTaskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cec419d1098d75a44493039524" ON "loy_tas_loy_pro_pro_loy_pro_pro" ("loyaltyProjectProgressId") `);
        await queryRunner.query(`CREATE TABLE "loyalty_project_progress_loyalty_tasks_loyalty_task" ("loyaltyProjectProgressId" integer NOT NULL, "loyaltyTaskId" integer NOT NULL, CONSTRAINT "PK_3686a50c73ea2ee1813c3673d8b" PRIMARY KEY ("loyaltyProjectProgressId", "loyaltyTaskId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a0e2773c940efb7c60e0b8808d" ON "loyalty_project_progress_loyalty_tasks_loyalty_task" ("loyaltyProjectProgressId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e3fb57c5f9453377e8d41c367" ON "loyalty_project_progress_loyalty_tasks_loyalty_task" ("loyaltyTaskId") `);
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress" ADD CONSTRAINT "FK_c296ee47e964a3073a9ec2bb5b6" FOREIGN KEY ("loyaltyProjectId") REFERENCES "loyalty_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress" ADD CONSTRAINT "FK_e87f9b55faf9511cbf68aa9f08a" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loy_tas_loy_pro_pro_loy_pro_pro" ADD CONSTRAINT "FK_90b073f3bd39f6aca1faecbfbfd" FOREIGN KEY ("loyaltyTaskId") REFERENCES "loyalty_task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "loy_tas_loy_pro_pro_loy_pro_pro" ADD CONSTRAINT "FK_cec419d1098d75a444930395246" FOREIGN KEY ("loyaltyProjectProgressId") REFERENCES "loyalty_project_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress_loyalty_tasks_loyalty_task" ADD CONSTRAINT "FK_a0e2773c940efb7c60e0b8808d2" FOREIGN KEY ("loyaltyProjectProgressId") REFERENCES "loyalty_project_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress_loyalty_tasks_loyalty_task" ADD CONSTRAINT "FK_5e3fb57c5f9453377e8d41c3672" FOREIGN KEY ("loyaltyTaskId") REFERENCES "loyalty_task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress_loyalty_tasks_loyalty_task" DROP CONSTRAINT "FK_5e3fb57c5f9453377e8d41c3672"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress_loyalty_tasks_loyalty_task" DROP CONSTRAINT "FK_a0e2773c940efb7c60e0b8808d2"`);
        await queryRunner.query(`ALTER TABLE "loy_tas_loy_pro_pro_loy_pro_pro" DROP CONSTRAINT "FK_cec419d1098d75a444930395246"`);
        await queryRunner.query(`ALTER TABLE "loy_tas_loy_pro_pro_loy_pro_pro" DROP CONSTRAINT "FK_90b073f3bd39f6aca1faecbfbfd"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress" DROP CONSTRAINT "FK_e87f9b55faf9511cbf68aa9f08a"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project_progress" DROP CONSTRAINT "FK_c296ee47e964a3073a9ec2bb5b6"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e3fb57c5f9453377e8d41c367"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0e2773c940efb7c60e0b8808d"`);
        await queryRunner.query(`DROP TABLE "loyalty_project_progress_loyalty_tasks_loyalty_task"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cec419d1098d75a44493039524"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_90b073f3bd39f6aca1faecbfbf"`);
        await queryRunner.query(`DROP TABLE "loy_tas_loy_pro_pro_loy_pro_pro"`);
        await queryRunner.query(`DROP TABLE "loyalty_project_progress"`);
    }

}
