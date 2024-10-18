import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeUnusedTables1692602131963 implements MigrationInterface {
  name = 'removeUnusedTables1692602131963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS personal_data CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS social_task CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS participation CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS hero_section CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS candidate CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS sale CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS deploy_history CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS browser_data CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS botometer_requests CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS project CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS event CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS network CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS auth_token CASCADE;`);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
