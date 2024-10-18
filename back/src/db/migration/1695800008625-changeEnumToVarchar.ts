import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeEnumToVarchar1695800008625 implements MigrationInterface {
  name = 'changeEnumToVarchar1695800008625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE loyalty_project ALTER COLUMN "projectType" TYPE VARCHAR');
    await queryRunner.query('ALTER TABLE loyalty_task ALTER COLUMN type TYPE VARCHAR');
    await queryRunner.query('ALTER TABLE tokens_storage_history ALTER COLUMN type TYPE VARCHAR');
    await queryRunner.query('ALTER TABLE contract ALTER COLUMN standard TYPE VARCHAR');
    await queryRunner.query('ALTER TABLE ambassador ALTER COLUMN method TYPE VARCHAR');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE loyalty_project ALTER COLUMN "projectType" TYPE loyalty_project_projecttype_enum',
    );
    await queryRunner.query('ALTER TABLE loyalty_task ALTER COLUMN type TYPE loyalty_task_type_enum');
    await queryRunner.query(
      'ALTER TABLE tokens_storage_history ALTER COLUMN type TYPE tokens_storage_history_type_enum',
    );
    await queryRunner.query('ALTER TABLE contract ALTER COLUMN standard TYPE token_standard_enum');
    await queryRunner.query('ALTER TABLE ambassador ALTER COLUMN method TYPE ambassador_method_enum');
  }
}
