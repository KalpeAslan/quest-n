import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeCompletedColumn1699519172222 implements MigrationInterface {
  name = 'removeCompletedColumn1699519172222';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "loyalty_project" AS lp SET "questStatus" = 
        (
	        CASE
		        WHEN lp."completed" THEN 'Completed'
		        ELSE 'Active'
	        END
        )
        `);
    await queryRunner.query(`ALTER TABLE "loyalty_project" DROP COLUMN "completed"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "loyalty_project" ADD "completed" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`
      UPDATE "loyalty_project" AS lp SET "completed" =
	    (
		    CASE 
			    WHEN "questStatus" = 'Completed' THEN True
			    ELSE False
		    END
	    )
      `);
  }
}
