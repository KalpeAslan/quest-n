import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedEventTable1659440497095 implements MigrationInterface {
    name = 'updatedEventTable1659440497095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "shortDescription" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "shortDescription" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "title" SET NOT NULL`);
    }

}
