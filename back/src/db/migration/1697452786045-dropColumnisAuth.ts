import { MigrationInterface, QueryRunner } from 'typeorm';

export class dropColumnisAuth1697452786045 implements MigrationInterface {
  name = 'dropColumnisAuth1697452786045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE wallet_user DROP COLUMN "isAuth";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No need to revert this migration
  }
}
