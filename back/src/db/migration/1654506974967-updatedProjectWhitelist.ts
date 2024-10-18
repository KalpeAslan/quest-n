import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedProjectWhitelist1654506974967 implements MigrationInterface {
    name = 'updatedProjectWhitelist1654506974967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "whitelistProjectInfo" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "whitelistProjectInfo"`);
    }

}
