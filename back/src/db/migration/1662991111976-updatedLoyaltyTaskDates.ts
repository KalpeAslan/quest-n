import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedLoyaltyTaskDates1662991111976 implements MigrationInterface {
    name = 'updatedLoyaltyTaskDates1662991111976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_task" DROP COLUMN "schedule"`);
        await queryRunner.query(`DROP TYPE "public"."loyalty_task_schedule_enum"`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" ALTER COLUMN "startAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" ALTER COLUMN "endAt" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_task" ALTER COLUMN "endAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" ALTER COLUMN "startAt" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."loyalty_task_schedule_enum" AS ENUM('daily', 'weekly')`);
        await queryRunner.query(`ALTER TABLE "loyalty_task" ADD "schedule" "public"."loyalty_task_schedule_enum"`);
    }

}
