import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';
import { getRepository } from 'typeorm';
import { EmailUser } from '../../src/db/entity';

describe('/token', () => {
  let bearerToken;
  beforeAll(async () => {
    await dbConnection();

    const emailUserRepository = getRepository(EmailUser);
    const emailUser = await emailUserRepository.findOne({});

    const loginResponse = await request(server)
      .post('/api/auth/login/email')
      .send({
        email: emailUser?.email,
        password: 'securepassword1',
      })
      .set('Accept', 'application/json');

    bearerToken = loginResponse['_body'].accessToken;
  });

  it('fetch token should get status 200', async () => {
    const response = await request(server).get(`/api/token`).set('Authorization', `Bearer ${bearerToken}`);
    expect(response.status).toBe(200);
  });
});
