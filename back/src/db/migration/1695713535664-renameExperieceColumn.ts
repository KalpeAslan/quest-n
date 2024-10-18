import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameExperieceColumn1695713535664 implements MigrationInterface {
  name = 'renameExperieceColumn1695713535664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE experience_progress RENAME COLUMN "experienceId" TO "experienceTaskId"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE experience_progress RENAME COLUMN "experienceTaskId" TO "experienceId"');
  }
}
