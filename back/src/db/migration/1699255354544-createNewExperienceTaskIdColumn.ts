import { MigrationInterface, QueryRunner } from 'typeorm';

export class createNewExperienceTaskIdColumn1699255354544 implements MigrationInterface {
  name = 'createNewExperienceTaskIdColumn1699255354544';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_task" ADD "experienceTaskId" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_task" DROP COLUMN "experienceTaskId"`);
  }
}
