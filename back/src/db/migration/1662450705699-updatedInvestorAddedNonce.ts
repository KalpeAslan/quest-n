import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedInvestorAddedNonce1662450705699 implements MigrationInterface {
    name = 'updatedInvestorAddedNonce1662450705699'

    public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`ALTER TABLE "investor" ADD "nonce" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "nonce"`);
    }

}
