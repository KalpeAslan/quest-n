import {MigrationInterface, QueryRunner} from "typeorm";

export class addedCreateAtQUestProgress1676888675647 implements MigrationInterface {
    name = 'addedCreateAtQUestProgress1676888675647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest_progress" ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest_progress" DROP COLUMN "createdDate"`);
    }

}
