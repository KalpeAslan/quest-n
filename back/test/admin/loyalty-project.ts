import request from 'supertest';
import { dbConnection } from '../testDb';
import { admin } from '../../src/admin/app';

describe('/api/admin/loyalty-project Endpoint Tests', () => {
  let bearerToken;
  beforeAll(async () => {
    await dbConnection();

    const loginResponse = await request(admin)
      .post('/login')
      .send({
        login: process.env.ADMIN_LOGIN,
        password: process.env.ADMIN_PASSWORD,
      })
      .set('Accept', 'application/json');

    bearerToken = loginResponse['_body'].accessToken;
  });

  it('loaylty projects should get status 200', async () => {
    const response = await request(admin).get(`/admin/loyalty-project/1`).set('Authorization', `Bearer 123`);
    expect(response.status).toBe(401);
  });
});
