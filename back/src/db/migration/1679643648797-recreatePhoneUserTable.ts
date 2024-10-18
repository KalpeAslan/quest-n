import { MigrationInterface, QueryRunner } from 'typeorm';

export class recreatePhoneUserTable1679643648797 implements MigrationInterface {
  name = 'recreatePhoneUserTable1679643648797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "phone_user" ("id" SERIAL NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "investorId" integer, CONSTRAINT "UQ_1b0e66adbfc026fb846c3a562bd" UNIQUE ("phone"), CONSTRAINT "REL_593e759ff2381c92f61b118a39" UNIQUE ("investorId"), CONSTRAINT "PK_2034c8bc8da57d18b69fd90bcfa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "phone_user" ADD CONSTRAINT "FK_593e759ff2381c92f61b118a392" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "phone_user" DROP CONSTRAINT "FK_593e759ff2381c92f61b118a392"`);
    await queryRunner.query(`DROP TABLE "phone_user"`);
  }
}
