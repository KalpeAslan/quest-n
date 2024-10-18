import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationEntity1695294136167 implements MigrationInterface {
  name = 'addNotificationEntity1695294136167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" character varying NOT NULL, "viewed" boolean NOT NULL DEFAULT false, "investorId" integer NOT NULL, "payload" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notification"`);
  }
}
