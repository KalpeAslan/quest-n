import { MigrationInterface, QueryRunner } from 'typeorm';

export class createExperieceLevelIdInInvestor1699383011761 implements MigrationInterface {
  name = 'createExperieceLevelIdInInvestor1699383011761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" ADD "experienceLevelId" integer`);
    await queryRunner.query(
      `ALTER TABLE "investor" ADD CONSTRAINT "FK_1fd197e12f2907e3356ce8fc6b6" FOREIGN KEY ("experienceLevelId") REFERENCES "experience_level"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "investor" DROP COLUMN "experienceLevelId"`);
  }
}
