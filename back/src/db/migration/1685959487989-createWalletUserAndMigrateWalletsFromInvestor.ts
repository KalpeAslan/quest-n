import { MigrationInterface, QueryRunner } from 'typeorm';

export class createWalletUserAndMigrateWalletsFromInvestor1685959487989 implements MigrationInterface {
  name = 'createWalletUserAndMigrateWalletsFromInvestor1685959487989';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wallet_user" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "isAuth" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "investorId" integer NOT NULL, CONSTRAINT "UQ_8c8062cd4b5b09adec5418db261" UNIQUE ("address"), CONSTRAINT "REL_546156ad005ab9e3da5a525fa7" UNIQUE ("investorId"), CONSTRAINT "PK_72548a47ac4a996cd254b082522" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_user" ADD CONSTRAINT "FK_546156ad005ab9e3da5a525fa76" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `INSERT INTO "wallet_user" ("address", "isAuth", "investorId") SELECT "wallet" AS "address", FALSE AS "isAuth", "id" AS "investorId" FROM "investor" AS i WHERE i."wallet" IS NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE "investor" DROP CONSTRAINT "UQ_9aa2bdade1ab1f41ecbed58bd84"`);
    await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "wallet"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" ADD "wallet" character varying`);
    await queryRunner.query(`ALTER TABLE "investor" ADD CONSTRAINT "UQ_9aa2bdade1ab1f41ecbed58bd84" UNIQUE ("wallet")`);

    await queryRunner.query(
      `UPDATE i SET i."wallet"=u."address" FROM "investor" AS i INNER JOIN "wallet_user" AS u ON i."id"=u."investorId" WHERE i."wallet" IS NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE "wallet_user" DROP CONSTRAINT "FK_546156ad005ab9e3da5a525fa76"`);
    await queryRunner.query(`DROP TABLE "wallet_user"`);
  }
}
