
import {MigrationInterface, QueryRunner} from "typeorm";

export class fixTypoRewardColumn1676624397609 implements MigrationInterface {
    name = 'fixTypoRewardColumn1676624397609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reward" RENAME COLUMN "whitelistng" TO "whitelisting"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reward" RENAME COLUMN "whitelisting" TO "whitelistng"`);
    }
}
