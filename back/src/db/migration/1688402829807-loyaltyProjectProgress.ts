import { MigrationInterface, QueryRunner } from 'typeorm';

export class loyaltyProjectProgress1688402829807 implements MigrationInterface {
  name = 'loyaltyProjectProgress1688402829807';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "loy_tas_loy_pro_pro_loy_pro_pro"`);
    await queryRunner.query(`DROP TABLE "loyalty_project_progress_loyalty_tasks_loyalty_task"`);
    await queryRunner.query(`DROP TABLE "loyalty_project_progress"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "loyalty_project_progress" (
            "id" integer DEFAULT nextval('loyalty_project_progress_id_seq') NOT NULL,
            "earnedPoints" numeric DEFAULT '0' NOT NULL,
            "loyaltyProjectId" integer NOT NULL,
            "investorId" integer NOT NULL,
            "completedLoyaltyTasks" jsonb NOT NULL,
            "updatedDate" timestamp DEFAULT now() NOT NULL,
            CONSTRAINT "PK_f81aba9d2c9b69a599303ac1fc6" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `);
    await queryRunner.query(`
        CREATE TABLE "loy_tas_loy_pro_pro_loy_pro_pro" (
            "loyaltyTaskId" integer NOT NULL,
            "loyaltyProjectProgressId" integer NOT NULL,
            CONSTRAINT "PK_b5375cef08e649146c4706c62dc" PRIMARY KEY ("loyaltyTaskId", "loyaltyProjectProgressId")
        ) WITH (oids = false);
    `);
    await queryRunner.query(`
        CREATE TABLE "public"."loyalty_project_progress_loyalty_tasks_loyalty_task" (
            "loyaltyProjectProgressId" integer NOT NULL,
            "loyaltyTaskId" integer NOT NULL,
            CONSTRAINT "PK_3686a50c73ea2ee1813c3673d8b" PRIMARY KEY ("loyaltyProjectProgressId", "loyaltyTaskId")
        ) WITH (oids = false);
    `);
  }
}
