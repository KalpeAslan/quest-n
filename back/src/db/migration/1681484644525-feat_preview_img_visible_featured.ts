import {MigrationInterface, QueryRunner} from "typeorm";

export class FeatPreviewImgVisibleFeatured1681484644525 implements MigrationInterface {
    name = 'FeatPreviewImgVisibleFeatured1681484644525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "nonce"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "featured" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "preview_img" character varying`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "visible" boolean NOT NULL DEFAULT true`);
        // await queryRunner.query(`ALTER TABLE "investor" ALTER COLUMN "analytics_id" DROP DEFAULT`);
        // await queryRunner.query(`ALTER TABLE "investor" ALTER COLUMN "analytics_id" SET DEFAULT uuid_generate_v4()`);
        // await queryRunner.query(`ALTER TABLE "localization" ALTER COLUMN "fieldType" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "localization" ALTER COLUMN "fieldType" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "investor" ALTER COLUMN "analytics_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "visible"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "preview_img"`);
        await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "featured"`);
        await queryRunner.query(`ALTER TABLE "investor" ADD "nonce" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    }

}
