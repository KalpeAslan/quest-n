import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTransactionId1686662054149 implements MigrationInterface {
  name = 'addTransactionId1686662054149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tokens_storage_history" ADD "transactionId" character varying`);

    await queryRunner.query(
      `ALTER TYPE "public"."tokens_storage_history_type_enum" RENAME TO "tokens_storage_history_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tokens_storage_history_type_enum" AS ENUM('loyaltyProject', 'referral', 'game_bet', 'game_win', 'game_cancel')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens_storage_history" ALTER COLUMN "type" TYPE "public"."tokens_storage_history_type_enum" USING "type"::"text"::"public"."tokens_storage_history_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."tokens_storage_history_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tokens_storage_history_type_enum_old" AS ENUM('loyaltyProject', 'referral')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens_storage_history" ALTER COLUMN "type" TYPE "public"."tokens_storage_history_type_enum_old" USING "type"::"text"::"public"."tokens_storage_history_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."tokens_storage_history_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."tokens_storage_history_type_enum_old" RENAME TO "tokens_storage_history_type_enum"`,
    );

    await queryRunner.query(`ALTER TABLE "tokens_storage_history" DROP COLUMN "transactionId"`);
  }
}
