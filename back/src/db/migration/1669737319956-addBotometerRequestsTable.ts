import { MigrationInterface, QueryRunner } from 'typeorm';

export class addBotometerRequestsTable1669737319956 implements MigrationInterface {
  name = 'addBotometerRequestsTable1669737319956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "botometer_requests" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9eebb5a3e68e94a128e05c5d909" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "botometer_requests"`);
  }
}
