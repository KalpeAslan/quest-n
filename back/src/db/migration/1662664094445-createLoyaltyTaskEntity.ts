import { MigrationInterface, QueryRunner } from 'typeorm';

export class createLoyaltyTaskEntity1662664094445 implements MigrationInterface {
  name = 'createLoyaltyTaskEntity1662664094445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."loyalty_task_type_enum" AS ENUM('visitLink', 'fullfiled')`);
    await queryRunner.query(
      `CREATE TABLE "loyalty_task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "points" numeric NOT NULL, "startAt" TIMESTAMP NOT NULL, "endAt" TIMESTAMP NOT NULL, "type" "public"."loyalty_task_type_enum" NOT NULL, "body" jsonb NOT NULL, "loyaltyProjectId" integer NOT NULL, CONSTRAINT "PK_66f5920e4b66e69250ed91ce292" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "loyalty_task" ADD CONSTRAINT "FK_bf4e1708197951723ffa43a112b" FOREIGN KEY ("loyaltyProjectId") REFERENCES "loyalty_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_task" DROP CONSTRAINT "FK_bf4e1708197951723ffa43a112b"`);
    await queryRunner.query(`DROP TABLE "loyalty_task"`);
    await queryRunner.query(`DROP TYPE "public"."loyalty_task_type_enum"`);
  }
}
