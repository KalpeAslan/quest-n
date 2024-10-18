import { MigrationInterface, QueryRunner } from 'typeorm';

export class createWhitelistToken1690385853772 implements MigrationInterface {
  name = 'createWhitelistToken1690385853772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "token" ("name", "symbol", "type") VALUES ('WL', 'WL', 'whitelist') ON CONFLICT DO NOTHING;
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "token" WHERE "name" = 'WL' AND "symbol" = 'WL' AND "type" = 'whitelist';`);
  }
}
