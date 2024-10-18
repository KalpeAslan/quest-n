import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNewColumnsIntoExperieceLevel1696399179744 implements MigrationInterface {
  name = 'addNewColumnsIntoExperieceLevel1696399179744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_level" ADD "questLimit" numeric DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "experience_level" ADD "bonusPointsPercentage" numeric DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_level" DROP COLUMN "questLimit"`);
    await queryRunner.query(`ALTER TABLE "experience_level" DROP COLUMN "bonusPointsPercentage"`);
  }
}
