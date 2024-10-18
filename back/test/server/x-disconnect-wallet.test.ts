import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';
import { getRepository } from 'typeorm';
import { EmailUser } from '../../src/db/entity';
import { taskProgressModel } from '../../src/db/models';

describe('/api/auth/wallet/disconnect Endpoint Tests', () => {
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

  it('disconnect wallet should get status 200', async () => {
    const response = await request(server)
      .post(`/api/auth/wallet/disconnect`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.status).toBe(200);
  });

  it('disconnect wallet should clear only wallet task progresses', async () => {
    const taskProgress = await taskProgressModel.findAll();
    expect(taskProgress.length).toEqual(2);
  });
});
