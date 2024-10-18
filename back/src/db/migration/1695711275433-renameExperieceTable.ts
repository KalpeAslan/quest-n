import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameExperieceTable1695711275433 implements MigrationInterface {
  name = 'renameExperieceTable1695711275433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('experience', 'experience_task');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('experience_task', 'experience');
  }
}
