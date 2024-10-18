import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDefaultNull1699267862890 implements MigrationInterface {
  name = 'addDefaultNull1699267862890';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "loyalty_task" 
        ALTER COLUMN "experienceTaskId" SET DEFAULT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "loyalty_task" 
        ALTER COLUMN "experienceTaskId" DROP DEFAULT;
    `);
  }
}
