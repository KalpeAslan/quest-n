import {MigrationInterface, QueryRunner} from "typeorm";

export class nullProject1648116243966 implements MigrationInterface {
    name = 'nullProject1648116243966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "hardCap" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "projectCurrency" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "projectCurrency" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "hardCap" SET NOT NULL`);
    }

}
