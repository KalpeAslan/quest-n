import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameRewardsTable1690111614253 implements MigrationInterface {
  name = 'renameRewardsTable1690111614253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE loyalty_rewards RENAME TO loyalty_reward;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE loyalty_reward RENAME TO loyalty_rewards;`);
  }
}
