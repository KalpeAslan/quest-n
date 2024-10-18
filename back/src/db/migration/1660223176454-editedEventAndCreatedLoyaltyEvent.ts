import {MigrationInterface, QueryRunner} from "typeorm";

export class editedEventAndCreatedLoyaltyEvent1660223176454 implements MigrationInterface {
    name = 'editedEventAndCreatedLoyaltyEvent1660223176454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "loyalty_event" ("id" SERIAL NOT NULL, "title" character varying, "shortDescription" character varying, "description" character varying NOT NULL, "status" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f91e996248a0b874eecb844fbed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "isBanner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "UQ_4add4010b81fe247e40f6d1c763" UNIQUE ("link")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "UQ_4add4010b81fe247e40f6d1c763"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "isBanner"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "status" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`DROP TABLE "loyalty_event"`);
    }

}
