import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedSociaTasks1653901575730 implements MigrationInterface {
  name = 'addedSociaTasks1653901575730';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."social_task_socialmedia_enum" AS ENUM('facebook', 'twitter', 'instagram', 'telegram', 'discord', 'reddit', 'youtube', 'medium')`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_task" ("id" SERIAL NOT NULL, "socialMedia" "public"."social_task_socialmedia_enum" NOT NULL, "taskTitle" character varying NOT NULL, "taskDescription" character varying NOT NULL, "actionTitle" character varying NOT NULL, "actionLink" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer NOT NULL, CONSTRAINT "PK_2a8ac69e85e608d927994792108" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "project" ADD "whitelistBasicInfo" character varying`);
    await queryRunner.query(
      `ALTER TABLE "social_task" ADD CONSTRAINT "FK_cdf67c68a5b50026082b842e7d8" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "social_task" DROP CONSTRAINT "FK_cdf67c68a5b50026082b842e7d8"`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "whitelistBasicInfo"`);
    await queryRunner.query(`DROP TABLE "social_task"`);
    await queryRunner.query(`DROP TYPE "public"."social_task_socialmedia_enum"`);
  }
}
