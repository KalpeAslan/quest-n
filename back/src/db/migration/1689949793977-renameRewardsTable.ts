import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameRewardsTable1689949793977 implements MigrationInterface {
  name = 'renameRewardsTable1689949793977';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE rewards RENAME TO loyalty_rewards;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE loyalty_rewards RENAME TO rewards;`);
  }
}
