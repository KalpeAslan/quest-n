import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';
import { getRepository } from 'typeorm';
import { EmailUser } from '../../src/db/entity';
import { loyaltyTaskModel } from '../../src/db/models/loyaltyTaskModel';

jest.mock('../../src/server/services/loyalty/task/complete/isLikeTweetLoyaltyTask', () => {
  return {
    status: true,
  };
});

describe('/api/loyalty-tasks/onboarding Endpoint Tests', () => {
  let bearerToken;
  let loyaltyTasks;
  beforeAll(async () => {
    await dbConnection();

    const emailUserRepository = getRepository(EmailUser);
    const emailUser = await emailUserRepository.findOne({});
    loyaltyTasks = await loyaltyTaskModel.getAll();

    const loginResponse = await request(server)
      .post('/api/auth/login/email')
      .send({
        email: emailUser?.email,
        password: 'securepassword1',
      })
      .set('Accept', 'application/json');

    bearerToken = loginResponse['_body'].accessToken;
  });

  /* ========== TWITTER TASK ==========*/

  it('(twitter | checkSpaceTwitter) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[9].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  it('(twitter | commentTweetTwitter) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[10].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  it('(twitter | likeTweetTwitter) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[11].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  it('(twitter | reTweetQuoteTwitter) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[12].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  it('(twitter | reTweetTwitter) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[13].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  it('(twitter | tweetTwitter) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[14].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  it('(twitter | mentionTwitter) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[15].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  it('(twitter | followTwitter) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[16].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  /* ========== DISCORD TASK ==========*/

  it('(discord | joinDiscord) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[17].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  it('(discord | joinDiscord) should return false', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[18].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(false);
  });

  it('(discord | roleDiscord) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[19].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });
});
