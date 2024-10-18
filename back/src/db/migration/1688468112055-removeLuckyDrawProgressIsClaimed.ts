import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeLuckyDrawProgressIsClaimed1688468112055 implements MigrationInterface {
  name = 'removeLuckyDrawProgressIsClaimed1688468112055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lucky_draw_progress" DROP COLUMN "isClaimed"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lucky_draw_progress" ADD "isClaimed" boolean NOT NULL DEFAULT false`);
  }
}
