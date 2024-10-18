import { MigrationInterface, QueryRunner } from 'typeorm';

export class deployHistory1647873297793 implements MigrationInterface {
  name = 'deployHistory1647873297793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "deploy_history" ("id" SERIAL NOT NULL, "transactionHash" character varying NOT NULL, "status" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer NOT NULL, CONSTRAINT "PK_3b4a8ca6fedee6183e0b58e9120" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "deploy_history" ADD CONSTRAINT "FK_f901b3e4b2ec8a7292acf27035f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "deploy_history" DROP CONSTRAINT "FK_f901b3e4b2ec8a7292acf27035f"`);
    await queryRunner.query(`DROP TABLE "deploy_history"`);
  }
}
