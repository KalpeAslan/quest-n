import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDefaultLoyaltyProjectJson1685727454082 implements MigrationInterface {
    name = 'updateDefaultLoyaltyProjectJson1685727454082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "body" SET DEFAULT '{"scoreboardRewards":{"rewards":[],"minTokenAmount":0},"luckyDrawRewards":{"rewards":[],"minTokenAmount":0}}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loyalty_project" ALTER COLUMN "body" SET DEFAULT '{"minTokenAmount": 0, "scoreboardRewards": []}'`);
    }

}
