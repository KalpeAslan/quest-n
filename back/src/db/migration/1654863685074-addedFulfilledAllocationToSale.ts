import {MigrationInterface, QueryRunner} from "typeorm";

export class addedFulfilledAllocationToSale1654863685074 implements MigrationInterface {
    name = 'addedFulfilledAllocationToSale1654863685074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" ADD "fulfilledAllocation" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale" DROP COLUMN "fulfilledAllocation"`);
    }

}
