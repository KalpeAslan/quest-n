import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeEmptyAqRewards1690911076238 implements MigrationInterface {
  name = 'removeEmptyAqRewards1690911076238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tokens = await queryRunner.query(`SELECT * FROM "token" where type = 'aq'`);
    const aqToken = tokens[0];
    await queryRunner.query(`DELETE FROM loyalty_reward WHERE "tokenId" = ${aqToken.id} AND amount = 0;`);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
