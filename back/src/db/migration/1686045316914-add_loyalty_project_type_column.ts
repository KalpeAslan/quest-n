import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLoyaltyProjectTypeColumn1686045316914 implements MigrationInterface {
    name = 'AddLoyaltyProjectTypeColumn1686045316914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."loyalty_project_projecttype_enum" AS ENUM('scoreboard', 'luckyDraw')`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "projectType" "public"."loyalty_project_projecttype_enum" NOT NULL DEFAULT 'scoreboard'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "projectType"`);
        await queryRunner.query(`DROP TYPE "public"."loyalty_project_projecttype_enum"`);
    }

}
