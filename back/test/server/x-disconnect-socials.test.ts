import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';
import { getRepository } from 'typeorm';
import { EmailUser } from '../../src/db/entity';
import { taskProgressModel } from '../../src/db/models';

describe('/api/socials/discord/disconnect Endpoint Tests', () => {
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

  it('disconnect discord should get status 200', async () => {
    const response = await request(server)
      .post(`/api/socials/discord/disconnect`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.status).toBe(200);
  });

  it('disconnect discord should clear only discord task progresses', async () => {
    const taskProgress = await taskProgressModel.findAll();
    expect(taskProgress.length).toEqual(7);
  });

  it('disconnect telegram should get status 200 and clear only telegram task progresses', async () => {
    const response = await request(server)
      .post(`/api/socials/telegram/disconnect`)
      .set('Authorization', `Bearer ${bearerToken}`);

    const taskProgress = await taskProgressModel.findAll();
    expect(response.status).toBe(200);
    expect(taskProgress.length).toEqual(6);
  });
});
