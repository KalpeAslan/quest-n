import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTaskProgressUniqueConstraint1697104393708 implements MigrationInterface {
  name = 'createTaskProgressUniqueConstraint1697104393708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_progress" ADD CONSTRAINT "UQ_investorId_loyaltyTaskId_loyaltyProjectId" UNIQUE ("loyaltyTaskId", "investorId", "loyaltyProjectId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_progress" DROP INDEX "UQ_investorId_loyaltyTaskId_loyaltyProjectId"`);
  }
}
