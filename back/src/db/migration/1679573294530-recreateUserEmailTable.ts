import {MigrationInterface, QueryRunner} from "typeorm";

export class recreateUserEmailTable1679573294530 implements MigrationInterface {
    name = 'recreateUserEmailTable1679573294530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "isResetPasswordVerified" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "investorId" integer, CONSTRAINT "UQ_dcde8f1412f320e90c0031f6018" UNIQUE ("email"), CONSTRAINT "REL_4a7c1146366a5066a71e5b87ce" UNIQUE ("investorId"), CONSTRAINT "PK_25f2e7a5a3fc2c9119ecfa40493" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_user" ADD CONSTRAINT "FK_4a7c1146366a5066a71e5b87ce1" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_user" DROP CONSTRAINT "FK_4a7c1146366a5066a71e5b87ce1"`);
        await queryRunner.query(`DROP TABLE "email_user"`);
    }

}
