import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedEnumToQuestType1689158818024 implements MigrationInterface {
  name = 'addedEnumToQuestType1689158818024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Rename old ENUM
    await queryRunner.query(
      `ALTER TYPE "public"."loyalty_project_projecttype_enum" RENAME TO "loyalty_project_projecttype_enum_old"`,
    );

    // 2. Create new ENUM
    await queryRunner.query(
      `CREATE TYPE "public"."loyalty_project_projecttype_enum" AS ENUM('scoreboard', 'luckyDraw', 'guaranteed')`,
    );

    // 3. Add a temporary column with new ENUM type
    await queryRunner.query(
      `ALTER TABLE "loyalty_project" ADD COLUMN "temp_projectType" "public"."loyalty_project_projecttype_enum"`,
    );

    // 4. Populate new column with values based on old column
    // Assuming 'scoreboard', 'luckyDraw', 'guaranteed' are the only possible values,
    // you'd do something like this:
    await queryRunner.query(
      `UPDATE "loyalty_project" SET "temp_projectType" = 'scoreboard' WHERE "projectType"::text = 'scoreboard'`,
    );
    await queryRunner.query(
      `UPDATE "loyalty_project" SET "temp_projectType" = 'luckyDraw' WHERE "projectType"::text = 'luckyDraw'`,
    );
    await queryRunner.query(
      `UPDATE "loyalty_project" SET "temp_projectType" = 'guaranteed' WHERE "projectType"::text = 'guaranteed'`,
    );
    // Add more UPDATE statements if you have more possible ENUM values

    // 5. Drop old column and rename the new column
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "projectType"`);
    await queryRunner.query(`ALTER TABLE "loyalty_project" RENAME COLUMN "temp_projectType" TO "projectType"`);

    // 6. Drop old ENUM
    await queryRunner.query(`DROP TYPE "public"."loyalty_project_projecttype_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."loyalty_project_projecttype_enum" DROP VALUE 'guaranteed'`);
  }
}
