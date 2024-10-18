import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeSuggestionTable1687869891717 implements MigrationInterface {
  name = 'removeSuggestionTable1687869891717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_progress" DROP COLUMN IF EXISTS "pointsPerLike"`);
    await queryRunner.query(`ALTER TABLE "task_progress" DROP COLUMN IF EXISTS "pointsPerRetweet"`);

    await queryRunner.query(
      `
      INSERT INTO "task_progress" (
        "earnedPoints",
        "loyaltyProjectId",
        "investorId", 
        "createdDate",  
        "completedAt", 
        "loyaltyTaskId",
        "json"
        )
        SELECT
            lt."points",
            lt."loyaltyProjectId",
            suggest."investorId",
            suggest."createdAt",
            suggest."createdAt",
            suggest."loyaltyTaskId",
            jsonb_build_object('email',suggest."email",'description',suggest."description",'status',suggest."status")
        FROM 
            "suggestion" as suggest 
            LEFT JOIN "loyalty_task" as lt
            ON suggest."loyaltyTaskId" = lt."id"
        WHERE lt."type" != 'multipleSuggestion'
      `,
    );
    await queryRunner.query(`DROP TABLE "suggestion"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_progress" ADD "pointsPerRetweet" numeric NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "task_progress" ADD "pointsPerLike" numeric NOT NULL DEFAULT '0'`);

    await queryRunner.query(`
        CREATE TABLE "suggestion" (
            "id" integer DEFAULT nextval('suggestion_id_seq') NOT NULL,
            "description" character varying NOT NULL,
            "email" character varying,
            "status" suggestion_status_enum,
            "investorId" integer,
            "loyaltyTaskId" integer,
            "loyaltyProjectProgressId" integer,
            "createdAt" timestamp DEFAULT now() NOT NULL,
            "questProgressId" integer,
            CONSTRAINT "PK_aa072a020434ddd7104de98eebb" PRIMARY KEY ("id")
        ) WITH (oids = false);
      `);
    await queryRunner.query(`
        INSERT INTO "suggestion" (
            "description",
            "email",
            "status",
            "investorId",
            "loyaltyTaskId",
            "loyaltyProjectProgressId",
            "createdAt",
            "questProgressId"
            )
            SELECT 
                "json"->>'description' AS "description",
                "json"->>'email' AS "email",
                "json"->>'status' AS "status",
                tp."investorId",
                tp."loyaltyTaskId",
                NULL AS "loyaltyProjectProgressId",
                tp."createdDate" AS "createdAt",
                qp."id" AS "questProgressId"
            FROM
                "task_progress" AS tp
                LEFT JOIN "loyalty_task" AS lt
                    ON tp."loyaltyTaskId" = lt."id"
                LEFT JOIN "quest_progress" AS qp
                    ON (lt."loyaltyProjectId" = qp."loyaltyProjectId" AND tp."investorId" = qp."investorId")
            WHERE lt."type" = 'suggestion' OR lt."type" = 'email'
      `);
  }
}
