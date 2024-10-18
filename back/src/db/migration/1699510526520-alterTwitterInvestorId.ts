import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTwitterInvestorId1699510526520 implements MigrationInterface {
  name = 'alterTwitterInvestorId1699510526520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "twitter_user" ADD CONSTRAINT "UQ_5d46ae9551c746c3efb9f7349f4" UNIQUE ("twitterId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "twitter_user" DROP CONSTRAINT "FK_a06b29eca647894493219871ff2"`);
  }
}
