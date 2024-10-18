import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';
import { getRepository } from 'typeorm';
import { EmailUser } from '../../src/db/entity';
import { loyaltyTaskModel } from '../../src/db/models/loyaltyTaskModel';

jest.mock('../../src/server/services/loyalty/task/complete/joinDiscordLoyaltyTask', () => {
  return {
    isJoinDiscordLoyaltyTask(investorId: number, loyaltyTask: any) {
      return {
        status: true,
        json: {},
      };
    },
  };
});

jest.mock('../../src/server/services/loyalty/task/complete/roleDiscordLoyaltyTask', () => {
  return {
    isRoleDiscordLoyaltyTask(investorId: number, loyaltyTask: any) {
      return {
        status: true,
        json: {},
      };
    },
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

  /* ========== ONBOARDING TASK ==========*/

  it('(onboarding task check) should get status 200', async () => {
    const response = await request(server)
      .get(`/api/loyalty-tasks/onboarding`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true); // Ensure response is an array

    // Check each task in the response
    response.body.forEach((task) => {
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('points');
      expect(task).toHaveProperty('startAt');
      expect(task).toHaveProperty('endAt');
      expect(task).toHaveProperty('type');
      expect(task).toHaveProperty('sortOrder');
      expect(task).toHaveProperty('required');
      expect(task).toHaveProperty('isOnboardingTask');
      expect(task).toHaveProperty('body');
      expect(task.body).toHaveProperty('isOnboardingTask');
      expect(task).toHaveProperty('status');
    });
  });

  /* ========== REQUIRED TASK ==========*/

  it('(required task check) should return false because required tasks are not completed', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[0].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(false);
  });

  it('(required task check) should return true because this is required task', async () => {
    console.log(loyaltyTasks[1]);
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[1].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);

    console.log(response.body);
    expect(response.body.success.status).toBe(true);
  });

  /* ========== ON CHAIN TASKS ==========*/

  it('(onchain | nft task check) Hold at least 1 custom ERC 721 token', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[5].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  it('(onchain | token task check) Hold at least 1 custom ERC 20 token', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[6].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  it('(onchain | blockchainUser task check) Make more than 1 transactions', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[7].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  it('(onchain | nativeHolder task check) Hold more than 0.5 goerli eth', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[8].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  /* ========== ALREADY COMPLETED TASKS ==========*/

  it('(onchain | nft task check) status should be false, because already completed', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[5].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success).toBe('false');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('errorCode');
    expect(response.body).toHaveProperty('statusCode');
    expect(response.body).toHaveProperty('message');
  });

  /* ========== REQUIRED TASK ==========*/

  it('(required task check) should return true because all required tasks are completed', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[0].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  /* ========== TWITTER TASK ==========*/
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
    expect(response.body.success.status).toBe(true);
  });

  it('(discord | roleDiscord) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[19].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });

  /* ========== TELEGRAM TASK ==========*/

  it('(telegram | joinTelegram) should return true', async () => {
    const response = await request(server)
      .post(`/api/loyalty-tasks/${loyaltyTasks[20].id}/completed`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.body.success.status).toBe(true);
  });
});
