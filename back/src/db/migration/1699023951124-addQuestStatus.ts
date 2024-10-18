import { MigrationInterface, QueryRunner } from 'typeorm';

export class addQuestStatus1699023951124 implements MigrationInterface {
  name = 'addQuestStatus1699023951124';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "questStatus" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "questStatus"`);
  }
}
