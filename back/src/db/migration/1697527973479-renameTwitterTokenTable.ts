import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameTwitterTokenTable1697527973479 implements MigrationInterface {
  name = 'renameTwitterTokenTable1697527973479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE twitter_token RENAME TO twitter_user;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE twitter_user RENAME TO twitter_token;`);
  }
}
