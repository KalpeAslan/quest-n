import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';
import { getRepository } from 'typeorm';
import { EmailUser } from '../../src/db/entity';

describe('/api/investor Endpoint Tests', () => {
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
    console.log('bearerToken', bearerToken);
  });

  it('should get status 200', async () => {
    const response = await request(server).get(`/api/investor/profile`).set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('should have the expected keys in the response', async () => {
    const response = await request(server).get(`/api/investor/profile`).set('Authorization', `Bearer ${bearerToken}`);

    // Top-level keys
    expect(response.body).toHaveProperty('canBeReferral');
    expect(response.body).toHaveProperty('connectedAccounts');
    expect(response.body).toHaveProperty('referralInfo');
    expect(response.body).toHaveProperty('questInfo');
    expect(response.body).toHaveProperty('security');

    // Nested keys
    expect(response.body.connectedAccounts).toHaveProperty('twitter');
    expect(response.body.connectedAccounts).toHaveProperty('discord');
    expect(response.body.connectedAccounts).toHaveProperty('telegram');
    expect(response.body.connectedAccounts).toHaveProperty('email');

    expect(response.body.referralInfo).toHaveProperty('referralProfit');
    expect(response.body.referralInfo).toHaveProperty('claimableReferralProfit');
    expect(response.body.referralInfo).toHaveProperty('referralCode');

    expect(response.body.questInfo).toHaveProperty('questProfit');
    expect(response.body.questInfo).toHaveProperty('completedQuests');
    expect(response.body.questInfo).toHaveProperty('completedTasksNumber');

    expect(response.body.security).toHaveProperty('twoFactorAuth');
    expect(response.body.security).toHaveProperty('phoneNumber');
  });
});
