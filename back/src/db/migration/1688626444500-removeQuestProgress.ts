import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeQuestProgress1688626444500 implements MigrationInterface {
  name = 'removeQuestProgress1688626444500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "quest_progress"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "public"."quest_progress" (
            "id" integer DEFAULT nextval('quest_progress_id_seq') NOT NULL,
            "earnedPoints" numeric DEFAULT '0' NOT NULL,
            "loyaltyProjectId" integer NOT NULL,
            "investorId" integer NOT NULL,
            "updatedDate" timestamp DEFAULT now() NOT NULL,
            "createdDate" timestamp DEFAULT now() NOT NULL,
            "lastCompletedAt" timestamp,
            "questInvitationCode" character varying,
            "questInviterInvestorId" integer,
            CONSTRAINT "PK_00270f6acd4a18f1c6ae6aa216a" PRIMARY KEY ("id")
        ) WITH (oids = false);
      `);
  }
}
