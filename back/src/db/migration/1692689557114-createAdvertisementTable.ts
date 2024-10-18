import { MigrationInterface, QueryRunner } from 'typeorm';

export class createAdvertisementTable1692689557114 implements MigrationInterface {
  name = 'createAdvertisementTable1692689557114';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "advertisement" (
            "id" SERIAL PRIMARY KEY,
            "title" VARCHAR NOT NULL DEFAULT '',
            "icon" BOOLEAN NOT NULL DEFAULT FALSE,
            "tooltip" VARCHAR DEFAULT '',
            "items" JSONB
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "advertisement";`);
  }
}
