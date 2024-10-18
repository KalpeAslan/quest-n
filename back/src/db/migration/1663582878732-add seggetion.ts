import {MigrationInterface, QueryRunner} from "typeorm";

export class addSeggetion1663582878732 implements MigrationInterface {
    name = 'addSeggetion1663582878732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "suggestion" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "email" character varying, CONSTRAINT "PK_aa072a020434ddd7104de98eebb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "suggestion"`);
    }

}
