import { MigrationInterface, QueryRunner } from 'typeorm';

export class createIndexForInviteTaskKeysInsideJson1688539921268 implements MigrationInterface {
  name = 'createIndexForInviteTaskKeysInsideJson1688539921268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE INDEX idx_questInvitationCode ON task_progress ((json ->> 'questInvitationCode'));
        `);

    await queryRunner.query(`
          CREATE INDEX idx_invitedInvestorIds ON task_progress USING gin ((json -> 'invitedInvestorIds'));
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP INDEX IF EXISTS idx_questInvitationCode;
        `);

    await queryRunner.query(`
          DROP INDEX IF EXISTS idx_invitedInvestorIds;
        `);
  }
}
