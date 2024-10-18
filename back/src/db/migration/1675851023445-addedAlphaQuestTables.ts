import {MigrationInterface, QueryRunner} from "typeorm";

export class addedAlphaQuestTables1675851023445 implements MigrationInterface {
    name = 'addedAlphaQuestTables1675851023445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quest_completed_tasks" ("id" SERIAL NOT NULL, "completedAt" TIMESTAMP NOT NULL, "questProgressId" integer NOT NULL, "loyaltyTaskId" integer NOT NULL, CONSTRAINT "PK_d25878780f12ba35ea729f728b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."checked_twitter_users_stats_history_type_enum" AS ENUM('likes', 'reTweets')`);
        await queryRunner.query(`CREATE TABLE "checked_twitter_users_stats_history" ("id" SERIAL NOT NULL, "type" "public"."checked_twitter_users_stats_history_type_enum" NOT NULL, "points" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "checkedTwitterUsersId" integer NOT NULL, "questCompletedTwitterUnlimitedTasksId" integer NOT NULL, CONSTRAINT "PK_05f4082186b5c30093e9b944ae1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quest_completed_twitter_unlimited_tasks" ("id" SERIAL NOT NULL, "tweetId" character varying NOT NULL, "completedAt" TIMESTAMP NOT NULL, "unlimitedEarnedPoints" numeric, "unlimitedLikesCount" numeric, "unlimitedReTweetsCount" numeric, "unlimitedEndAt" TIMESTAMP, "questProgressId" integer NOT NULL, "loyaltyTaskId" integer NOT NULL, "investorId" integer NOT NULL, CONSTRAINT "PK_42f7b47b411b5f5ab3a8214a1fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quest_progress" ("id" SERIAL NOT NULL, "earnedPoints" numeric NOT NULL DEFAULT '0', "loyaltyProjectId" integer NOT NULL, "investorId" integer NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_00270f6acd4a18f1c6ae6aa216a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quest_completed_fulfilled_tasks" ("id" SERIAL NOT NULL, "answer" character varying NOT NULL, "completedAt" TIMESTAMP NOT NULL, "questProgressId" integer NOT NULL, "loyaltyTaskId" integer NOT NULL, CONSTRAINT "PK_041248c40c59d756672858d7614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "suggestion" ADD "questProgressId" integer`);
        await queryRunner.query(`ALTER TABLE "checked_twitter_users" ADD CONSTRAINT "UQ_2977ceb68f8ac143081af11cb06" UNIQUE ("twitterId")`);
        await queryRunner.query(`ALTER TABLE "checked_twitter_users" ALTER COLUMN "score" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quest_completed_tasks" ADD CONSTRAINT "FK_452316b7480bb582af6a523ec58" FOREIGN KEY ("questProgressId") REFERENCES "quest_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_completed_tasks" ADD CONSTRAINT "FK_77851de67acd91d94488ea85a9e" FOREIGN KEY ("loyaltyTaskId") REFERENCES "loyalty_task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checked_twitter_users_stats_history" ADD CONSTRAINT "FK_99941bfb2657af8ba19441e9852" FOREIGN KEY ("checkedTwitterUsersId") REFERENCES "checked_twitter_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checked_twitter_users_stats_history" ADD CONSTRAINT "FK_eebc5c6b9b905406ca6d76f721f" FOREIGN KEY ("questCompletedTwitterUnlimitedTasksId") REFERENCES "quest_completed_twitter_unlimited_tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_completed_twitter_unlimited_tasks" ADD CONSTRAINT "FK_dbee63f3eb30376e8570d33dcb5" FOREIGN KEY ("questProgressId") REFERENCES "quest_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_completed_twitter_unlimited_tasks" ADD CONSTRAINT "FK_6221d374f6ea46431ca2cad44f8" FOREIGN KEY ("loyaltyTaskId") REFERENCES "loyalty_task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_completed_twitter_unlimited_tasks" ADD CONSTRAINT "FK_f37db6ed87d7dbe64ff3fa5c3c0" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suggestion" ADD CONSTRAINT "FK_6081a5e3fd23bbca0cb5128f874" FOREIGN KEY ("questProgressId") REFERENCES "quest_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_progress" ADD CONSTRAINT "FK_b498ad2ae7e413d0c244915f322" FOREIGN KEY ("loyaltyProjectId") REFERENCES "loyalty_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_progress" ADD CONSTRAINT "FK_a9cde202498df98cba9f65cf789" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_completed_fulfilled_tasks" ADD CONSTRAINT "FK_94045f6bead2f26f51e78d15d4d" FOREIGN KEY ("questProgressId") REFERENCES "quest_progress"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quest_completed_fulfilled_tasks" ADD CONSTRAINT "FK_d8694642249b20038ad156ce655" FOREIGN KEY ("loyaltyTaskId") REFERENCES "loyalty_task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest_completed_fulfilled_tasks" DROP CONSTRAINT "FK_d8694642249b20038ad156ce655"`);
        await queryRunner.query(`ALTER TABLE "quest_completed_fulfilled_tasks" DROP CONSTRAINT "FK_94045f6bead2f26f51e78d15d4d"`);
        await queryRunner.query(`ALTER TABLE "quest_progress" DROP CONSTRAINT "FK_a9cde202498df98cba9f65cf789"`);
        await queryRunner.query(`ALTER TABLE "quest_progress" DROP CONSTRAINT "FK_b498ad2ae7e413d0c244915f322"`);
        await queryRunner.query(`ALTER TABLE "suggestion" DROP CONSTRAINT "FK_6081a5e3fd23bbca0cb5128f874"`);
        await queryRunner.query(`ALTER TABLE "quest_completed_twitter_unlimited_tasks" DROP CONSTRAINT "FK_f37db6ed87d7dbe64ff3fa5c3c0"`);
        await queryRunner.query(`ALTER TABLE "quest_completed_twitter_unlimited_tasks" DROP CONSTRAINT "FK_6221d374f6ea46431ca2cad44f8"`);
        await queryRunner.query(`ALTER TABLE "quest_completed_twitter_unlimited_tasks" DROP CONSTRAINT "FK_dbee63f3eb30376e8570d33dcb5"`);
        await queryRunner.query(`ALTER TABLE "checked_twitter_users_stats_history" DROP CONSTRAINT "FK_eebc5c6b9b905406ca6d76f721f"`);
        await queryRunner.query(`ALTER TABLE "checked_twitter_users_stats_history" DROP CONSTRAINT "FK_99941bfb2657af8ba19441e9852"`);
        await queryRunner.query(`ALTER TABLE "quest_completed_tasks" DROP CONSTRAINT "FK_77851de67acd91d94488ea85a9e"`);
        await queryRunner.query(`ALTER TABLE "quest_completed_tasks" DROP CONSTRAINT "FK_452316b7480bb582af6a523ec58"`);
        await queryRunner.query(`ALTER TABLE "checked_twitter_users" ALTER COLUMN "score" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "checked_twitter_users" DROP CONSTRAINT "UQ_2977ceb68f8ac143081af11cb06"`);
        await queryRunner.query(`ALTER TABLE "suggestion" DROP COLUMN "questProgressId"`);
        await queryRunner.query(`DROP TABLE "quest_completed_fulfilled_tasks"`);
        await queryRunner.query(`DROP TABLE "quest_progress"`);
        await queryRunner.query(`DROP TABLE "quest_completed_twitter_unlimited_tasks"`);
        await queryRunner.query(`DROP TABLE "checked_twitter_users_stats_history"`);
        await queryRunner.query(`DROP TYPE "public"."checked_twitter_users_stats_history_type_enum"`);
        await queryRunner.query(`DROP TABLE "quest_completed_tasks"`);
    }

}
