import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeQuestCompletedFulfilledTasks1687957568939 implements MigrationInterface {
  name = 'removeQuestCompletedFulfilledTasks1687957568939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "quest_completed_fulfilled_tasks"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "public"."quest_completed_fulfilled_tasks" (
            "id" integer DEFAULT nextval('quest_completed_fulfilled_tasks_id_seq') NOT NULL,
            "answer" character varying NOT NULL,
            "completedAt" timestamp NOT NULL,
            "questProgressId" integer NOT NULL,
            "loyaltyTaskId" integer NOT NULL,
            CONSTRAINT "PK_041248c40c59d756672858d7614" PRIMARY KEY ("id")
        ) WITH (oids = false);
    `);
  }
}
