import {MigrationInterface, QueryRunner} from "typeorm";

export class addedTelegramUser1668766402156 implements MigrationInterface {
    name = 'addedTelegramUser1668766402156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "telegram_user" ("id" SERIAL NOT NULL, "telegramId" character varying NOT NULL, "investorId" integer NOT NULL, CONSTRAINT "REL_b7cad663a34fc2f650e07cc201" UNIQUE ("investorId"), CONSTRAINT "PK_8e00b1def3edd3510248136f820" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "telegram_user" ADD CONSTRAINT "FK_b7cad663a34fc2f650e07cc2012" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "telegram_user" DROP CONSTRAINT "FK_b7cad663a34fc2f650e07cc2012"`);
        await queryRunner.query(`DROP TABLE "telegram_user"`);
    }

}
