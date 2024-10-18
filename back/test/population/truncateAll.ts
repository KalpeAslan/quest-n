// tests/integration/user.test.ts
import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';

describe('Truncate Database Tests', () => {
  beforeAll(async () => {
    await dbConnection();
    // dbTruncateAll();
  });

  it('healthcheck endpoint', async () => {
    const response = await request(server).get(`/healthcheck`);
    expect(response.status).toBe(200);
  });
});
