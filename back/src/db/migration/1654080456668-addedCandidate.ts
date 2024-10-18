import {MigrationInterface, QueryRunner} from "typeorm";

export class addedCandidate1654080456668 implements MigrationInterface {
    name = 'addedCandidate1654080456668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "candidate" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "twitter" character varying NOT NULL, "telegram" character varying NOT NULL, "isWhitelisted" boolean NOT NULL DEFAULT true, "investorId" integer NOT NULL, "projectId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b0ddec158a9a60fbc785281581b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2420753f47474eb54a27befe25" ON "candidate" ("projectId", "investorId") `);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_ecdeaaeaacb36efd2f8c36b0640" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_8ba53e4de93414d6af2de67835f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_8ba53e4de93414d6af2de67835f"`);
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_ecdeaaeaacb36efd2f8c36b0640"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2420753f47474eb54a27befe25"`);
        await queryRunner.query(`DROP TABLE "candidate"`);
    }

}
