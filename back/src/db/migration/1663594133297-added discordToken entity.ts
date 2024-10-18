import {MigrationInterface, QueryRunner} from "typeorm";

export class addedDiscordTokenEntity1663594133297 implements MigrationInterface {
    name = 'addedDiscordTokenEntity1663594133297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "discord_token" ("id" SERIAL NOT NULL, "discordId" character varying NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "expiredIn" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "investorId" integer NOT NULL, CONSTRAINT "REL_d4fcdd0b1af829fb283157725e" UNIQUE ("investorId"), CONSTRAINT "PK_3accea1b1928de75222c2a93906" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "discord_token" ADD CONSTRAINT "FK_d4fcdd0b1af829fb283157725e1" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discord_token" DROP CONSTRAINT "FK_d4fcdd0b1af829fb283157725e1"`);
        await queryRunner.query(`DROP TABLE "discord_token"`);
    }

}
