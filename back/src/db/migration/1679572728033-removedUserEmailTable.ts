import { MigrationInterface, QueryRunner } from 'typeorm';

export class removedUserEmailTable1679572728033 implements MigrationInterface {
  name = 'removedUserEmailTable1679572728033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS email_user');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS email_user (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            confirmed BOOLEAN NOT NULL DEFAULT false,
            is_reset_password_verified BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            investor_id INT,
            CONSTRAINT fk_investor_email_user
              FOREIGN KEY (investor_id)
              REFERENCES investor (id)
              ON DELETE CASCADE
          );`);
  }
}
