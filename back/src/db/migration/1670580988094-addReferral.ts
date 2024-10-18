import {MigrationInterface, QueryRunner} from "typeorm";

export class addReferral1670580988094 implements MigrationInterface {
    name = 'addReferral1670580988094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "referral_info" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "personalVolume" numeric NOT NULL DEFAULT '0', "groupVolume" numeric NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "investorId" integer NOT NULL, "referrerId" integer, CONSTRAINT "UQ_a29bc6d1ea5ff1eaddc3accb913" UNIQUE ("code"), CONSTRAINT "REL_d9a38c391151baeb8c1a8d06e8" UNIQUE ("investorId"), CONSTRAINT "PK_4ad7f235a2c04884fb4cdc1aad0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "referral_info" ADD CONSTRAINT "FK_f27be782a7c42eb56d3507cf273" FOREIGN KEY ("referrerId") REFERENCES "referral_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referral_info" ADD CONSTRAINT "FK_d9a38c391151baeb8c1a8d06e8b" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral_info" DROP CONSTRAINT "FK_d9a38c391151baeb8c1a8d06e8b"`);
        await queryRunner.query(`ALTER TABLE "referral_info" DROP CONSTRAINT "FK_f27be782a7c42eb56d3507cf273"`);
        await queryRunner.query(`DROP TABLE "referral_info"`);
    }

}
