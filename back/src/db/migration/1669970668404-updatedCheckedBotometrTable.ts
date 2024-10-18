import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedCheckedBotometrTable1669970668404 implements MigrationInterface {
    name = 'updatedCheckedBotometrTable1669970668404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checked_twitter_users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checked_twitter_users" DROP COLUMN "createdAt"`);
    }

}
