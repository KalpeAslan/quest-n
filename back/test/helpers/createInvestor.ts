import { dbConnection, TestDb } from '../testDb';

import { Investor } from '../../src/db/entity';

export const createInvestor = async (investorData) => {
  const connection = await dbConnection();
  const db = new TestDb(connection);
  const investor = await db.save<Investor>(Investor, investorData);
  return { investor };
};
