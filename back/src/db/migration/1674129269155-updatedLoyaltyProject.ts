import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedLoyaltyProject1674129269155 implements MigrationInterface {
    name = 'updatedLoyaltyProject1674129269155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "media"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "referral_info" ADD CONSTRAINT "FK_781930048dc1170af50883be738" FOREIGN KEY ("referralRanksRuleId") REFERENCES "referral_ranks_rule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral_info" DROP CONSTRAINT "FK_781930048dc1170af50883be738"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "avatar" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "media" jsonb NOT NULL`);
    }

}
