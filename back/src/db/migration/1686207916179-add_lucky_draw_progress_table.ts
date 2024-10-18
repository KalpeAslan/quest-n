import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLuckyDrawProgressTable1686207916179 implements MigrationInterface {
  name = 'AddLuckyDrawProgressTable1686207916179';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "lucky_draw_progress"
                             (
                               "id"               SERIAL    NOT NULL,
                               "loyaltyProjectId" integer   NOT NULL,
                               "investorId"       integer   NOT NULL,
                               "updatedDate"      TIMESTAMP NOT NULL DEFAULT now(),
                               "createdDate"      TIMESTAMP NOT NULL DEFAULT now(),
                               "isClaimed"        boolean   NOT NULL DEFAULT false,
                               CONSTRAINT "PK_4019c0e6e3b7c69c8490adda86d" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "lucky_draw_progress"
      ADD CONSTRAINT "FK_22be60cde82ab61d565d2067d80" FOREIGN KEY ("loyaltyProjectId") REFERENCES "loyalty_project" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "lucky_draw_progress"
      ADD CONSTRAINT "FK_8bbbc85bf249dd7e03ad3f62985" FOREIGN KEY ("investorId") REFERENCES "investor" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lucky_draw_progress" DROP CONSTRAINT "FK_8bbbc85bf249dd7e03ad3f62985"`);
    await queryRunner.query(`ALTER TABLE "lucky_draw_progress" DROP CONSTRAINT "FK_22be60cde82ab61d565d2067d80"`);
    await queryRunner.query(`DROP TABLE "lucky_draw_progress"`);
  }
}
