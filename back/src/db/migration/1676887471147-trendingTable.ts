import {MigrationInterface, QueryRunner} from "typeorm";

export class trendingTable1676887471147 implements MigrationInterface {
    name = 'trendingTable1676887471147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "trending_loyalty_projects" ("id" SERIAL NOT NULL, "loyaltyProjectId" integer NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c82e30a7504b760818187abf29f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "trending_loyalty_projects" ADD CONSTRAINT "FK_343ea61a32a518941ff5cef0cef" FOREIGN KEY ("loyaltyProjectId") REFERENCES "loyalty_project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "trending_loyalty_projects" DROP CONSTRAINT "FK_343ea61a32a518941ff5cef0cef"`);
        await queryRunner.query(`DROP TABLE "trending_loyalty_projects"`);
    }

}
