import {MigrationInterface, QueryRunner} from "typeorm";

export class addedTwoFactorTables1673612032224 implements MigrationInterface {
    name = 'addedTwoFactorTables1673612032224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "two_factor_auth" ("id" SERIAL NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "phoneNumber" character varying NOT NULL, "investorId" integer NOT NULL, CONSTRAINT "REL_293b6d96f974a983b1a465f5f9" UNIQUE ("investorId"), CONSTRAINT "PK_ac930594b4dbe3771cf16cd108d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "two_factor_code_send_history" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "investorId" integer NOT NULL, CONSTRAINT "PK_d99ca3a07011ee67f64efe41b81" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "two_factor_auth" ADD CONSTRAINT "FK_293b6d96f974a983b1a465f5f95" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "two_factor_code_send_history" ADD CONSTRAINT "FK_f8f581ca11470b50f1efdc282ee" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "two_factor_code_send_history" DROP CONSTRAINT "FK_f8f581ca11470b50f1efdc282ee"`);
        await queryRunner.query(`ALTER TABLE "two_factor_auth" DROP CONSTRAINT "FK_293b6d96f974a983b1a465f5f95"`);
        await queryRunner.query(`DROP TABLE "two_factor_code_send_history"`);
        await queryRunner.query(`DROP TABLE "two_factor_auth"`);
    }

}
