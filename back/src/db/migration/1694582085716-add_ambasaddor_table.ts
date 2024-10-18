import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAmbasaddorTable1694582085716 implements MigrationInterface {
  name = 'addAmbasaddorTable1694582085716';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."ambassador_method_enum" AS ENUM('email', 'telegram', 'twitter')`);
    await queryRunner.query(
      `CREATE TABLE "ambassador" ("id" SERIAL NOT NULL, "contact" character varying, "method" "public"."ambassador_method_enum", CONSTRAINT "UQ_6bdfb9abeea1c52c7829ca653e7" UNIQUE ("contact"), CONSTRAINT "PK_f95940ec54c3e389f33720c39d6" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "ambassador"`);
    await queryRunner.query(`DROP TYPE "public"."ambassador_method_enum"`);
  }
}
