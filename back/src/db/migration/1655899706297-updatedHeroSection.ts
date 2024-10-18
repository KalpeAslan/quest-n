import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatedHeroSection1655899706297 implements MigrationInterface {
  name = 'updatedHeroSection1655899706297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hero_section" ADD "priorityNumber" numeric NOT NULL DEFAULT '1'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hero_section" DROP COLUMN "priorityNumber"`);
  }
}
