import { MigrationInterface, QueryRunner } from 'typeorm';

export class initUserSettingsModal1701093955282 implements MigrationInterface {
  name = 'initUserSettingsModal1701093955282';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_modal_settings" ("id" SERIAL NOT NULL, "investorId" integer NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_461cb05bdfb14040b526cfed4d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_modal_settings" ADD CONSTRAINT "FK_679f8f691e4f5bd07307f99f496" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_modal_settings"`);
    await queryRunner.query(`ALTER TABLE "user_modal_settings" DROP CONSTRAINT "FK_679f8f691e4f5bd07307f99f496"`);
  }
}
