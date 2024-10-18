import {MigrationInterface, QueryRunner} from "typeorm";

export class addedTwitterTokenTable1663140957505 implements MigrationInterface {
    name = 'addedTwitterTokenTable1663140957505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "twitter_token" ("id" SERIAL NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "expiredIn" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "investorId" integer NOT NULL, CONSTRAINT "REL_a485b28ac3c7f60dd86b2da9ba" UNIQUE ("investorId"), CONSTRAINT "PK_90af47fc5a695c96bff375d7a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "twitter_token" ADD CONSTRAINT "FK_a485b28ac3c7f60dd86b2da9ba1" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "twitter_token" DROP CONSTRAINT "FK_a485b28ac3c7f60dd86b2da9ba1"`);
        await queryRunner.query(`DROP TABLE "twitter_token"`);
    }

}
