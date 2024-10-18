import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameIndexForTaskProgress1688542683748 implements MigrationInterface {
  name = 'changeIndexForTaskProgress1688542683748';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER INDEX idx_questInvitationCode RENAME TO idx_inviteCode
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER INDEX idx_inviteCode RENAME TO idx_questInvitationCode
    `);
  }
}
