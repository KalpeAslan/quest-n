import { MigrationInterface, QueryRunner } from 'typeorm';

export class addBonusLuckyDrawPercentageColumnForTableExperienceLevel1696349104767 implements MigrationInterface {
  name = 'addBonusLuckyDrawPercentageColumnForTableExperienceLevel1696349104767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_level" ADD "bonusLuckyDrawPercentage" numeric DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_level" DROP COLUMN "bonusLuckyDrawPercentage"`);
  }
}
