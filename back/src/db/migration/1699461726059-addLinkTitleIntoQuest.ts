import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLinkTitleIntoQuest1699461726059 implements MigrationInterface {
  name = 'addLinkTitleIntoQuest1699461726059';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_level" ADD "linkTitle" character varying NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "experience_level" DROP COLUMN "linkTitle"`);
  }
}
