import { MigrationInterface, QueryRunner } from 'typeorm';

export class removedPhoneUserTable1679643536526 implements MigrationInterface {
  name = 'removedPhoneUserTable1679643536526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS phone_user`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE phone_user (
            id SERIAL PRIMARY KEY,
            phone VARCHAR NOT NULL UNIQUE,
            password VARCHAR NOT NULL,
            confirmed BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            investor_id INTEGER,
            CONSTRAINT fk_investor_id FOREIGN KEY (investor_id) REFERENCES investor(id) ON DELETE CASCADE
          );
          `);
  }
}
