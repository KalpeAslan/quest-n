import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';

describe('User Endpoint Tests', () => {
  beforeAll(async () => {
    await dbConnection();
  });

  it('should get a user by ID', async () => {
    const response = await request(server).get(`/api/loyalty-projects`);
    expect(response.status).toBe(200);
  });
});
