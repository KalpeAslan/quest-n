import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeAgToAgInTokenTable1690209588613 implements MigrationInterface {
  name = 'changeAgToAgInTokenTable1690209588613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE public.token SET name = 'AQ', symbol = 'AQ' WHERE name = 'AG' AND symbol = 'AG';`);

    await queryRunner.query(`CREATE TYPE token_type AS ENUM ('nft', 'token', 'whitelist', 'aq');`);

    await queryRunner.query(`ALTER TABLE public.token ADD COLUMN type token_type;`);

    await queryRunner.query(`
    UPDATE public.token 
    SET type = CAST(
      CASE 
        WHEN LOWER(name) LIKE '%nft%' THEN 'nft'
        WHEN LOWER(name) LIKE '%aq%' THEN 'aq'
        ELSE 'token'
      END AS token_type
    );
      `);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
