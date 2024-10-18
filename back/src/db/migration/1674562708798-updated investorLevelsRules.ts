import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedInvestorLevelsRules1674562708798 implements MigrationInterface {
    name = 'updatedInvestorLevelsRules1674562708798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor_levels_rule" ADD "avatar" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor_levels_rule" DROP COLUMN "avatar"`);
    }

}
