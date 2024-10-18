import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeExperienceTaskTypeToNotNull1699607560317 implements MigrationInterface {
  name = 'changeExperienceTaskTypeToNotNull1699607560317';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_task" DROP CONSTRAINT "UQ_56f9c39b9f85d1c48b87ef7550b"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "experience_task" ADD CONSTRAINT "UQ_56f9c39b9f85d1c48b87ef7550b" UNIQUE ("type")`,
    );
  }
}
