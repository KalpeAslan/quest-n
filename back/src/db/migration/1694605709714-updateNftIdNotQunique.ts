import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateNftIdNotQunique1694605709714 implements MigrationInterface {
  name = 'updateNftIdNotQunique1694605709714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // drop the unique constraint on nftId
    await queryRunner.query(`ALTER TABLE "nft" DROP CONSTRAINT "UQ_1156642d40093c2cf27efc405a5"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // reintroduce the unique constraint on nftId for reversing the migration
    await queryRunner.query(`ALTER TABLE "nft" ADD CONSTRAINT "UQ_1156642d40093c2cf27efc405a5" UNIQUE ("nftId")`);
  }
}
