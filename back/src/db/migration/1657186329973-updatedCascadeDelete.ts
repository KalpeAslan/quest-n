import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatedCascadeDelete1657186329973 implements MigrationInterface {
  name = 'updatedCascadeDelete1657186329973';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "deploy_history" DROP CONSTRAINT "FK_5f07d3f46b75b2536fe8eb323bd"`);
    await queryRunner.query(`ALTER TABLE "social_task" DROP CONSTRAINT "FK_cdf67c68a5b50026082b842e7d8"`);
    await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_2b21749e4a6f9d9ea251dfaafd2"`);
    await queryRunner.query(`ALTER TABLE "participation" DROP CONSTRAINT "FK_f308cb0b3a7472b2bfc61c7b555"`);
    await queryRunner.query(`ALTER TABLE "participation" DROP CONSTRAINT "FK_312794cb4d910fa6c7697f15382"`);
    await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_ecdeaaeaacb36efd2f8c36b0640"`);
    await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_8ba53e4de93414d6af2de67835f"`);
    await queryRunner.query(
      `ALTER TABLE "deploy_history" ADD CONSTRAINT "FK_5f07d3f46b75b2536fe8eb323bd" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_task" ADD CONSTRAINT "FK_cdf67c68a5b50026082b842e7d8" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "FK_2b21749e4a6f9d9ea251dfaafd2" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "participation" ADD CONSTRAINT "FK_f308cb0b3a7472b2bfc61c7b555" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "participation" ADD CONSTRAINT "FK_312794cb4d910fa6c7697f15382" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "candidate" ADD CONSTRAINT "FK_ecdeaaeaacb36efd2f8c36b0640" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "candidate" ADD CONSTRAINT "FK_8ba53e4de93414d6af2de67835f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_8ba53e4de93414d6af2de67835f"`);
    await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_ecdeaaeaacb36efd2f8c36b0640"`);
    await queryRunner.query(`ALTER TABLE "participation" DROP CONSTRAINT "FK_312794cb4d910fa6c7697f15382"`);
    await queryRunner.query(`ALTER TABLE "participation" DROP CONSTRAINT "FK_f308cb0b3a7472b2bfc61c7b555"`);
    await queryRunner.query(`ALTER TABLE "sale" DROP CONSTRAINT "FK_2b21749e4a6f9d9ea251dfaafd2"`);
    await queryRunner.query(`ALTER TABLE "social_task" DROP CONSTRAINT "FK_cdf67c68a5b50026082b842e7d8"`);
    await queryRunner.query(`ALTER TABLE "deploy_history" DROP CONSTRAINT "FK_5f07d3f46b75b2536fe8eb323bd"`);
    await queryRunner.query(
      `ALTER TABLE "candidate" ADD CONSTRAINT "FK_8ba53e4de93414d6af2de67835f" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "candidate" ADD CONSTRAINT "FK_ecdeaaeaacb36efd2f8c36b0640" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "participation" ADD CONSTRAINT "FK_312794cb4d910fa6c7697f15382" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "participation" ADD CONSTRAINT "FK_f308cb0b3a7472b2bfc61c7b555" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sale" ADD CONSTRAINT "FK_2b21749e4a6f9d9ea251dfaafd2" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_task" ADD CONSTRAINT "FK_cdf67c68a5b50026082b842e7d8" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deploy_history" ADD CONSTRAINT "FK_5f07d3f46b75b2536fe8eb323bd" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
