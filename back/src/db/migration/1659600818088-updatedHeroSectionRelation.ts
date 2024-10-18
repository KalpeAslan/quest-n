import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedHeroSectionRelation1659600818088 implements MigrationInterface {
    name = 'updatedHeroSectionRelation1659600818088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hero_section" DROP CONSTRAINT "FK_2c0c32f0f4e7515b03aba3e09c7"`);
        await queryRunner.query(`ALTER TABLE "hero_section" ADD CONSTRAINT "FK_2c0c32f0f4e7515b03aba3e09c7" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hero_section" DROP CONSTRAINT "FK_2c0c32f0f4e7515b03aba3e09c7"`);
        await queryRunner.query(`ALTER TABLE "hero_section" ADD CONSTRAINT "FK_2c0c32f0f4e7515b03aba3e09c7" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
