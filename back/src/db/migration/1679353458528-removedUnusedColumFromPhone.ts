import {MigrationInterface, QueryRunner} from "typeorm";

export class removedUnusedColumFromPhone1679353458528 implements MigrationInterface {
    name = 'removedUnusedColumFromPhone1679353458528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phone_user" DROP COLUMN "isResetPasswordVerified"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "phone_user" ADD "isResetPasswordVerified" boolean NOT NULL DEFAULT false`);
    }

}
