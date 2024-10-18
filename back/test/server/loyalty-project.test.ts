import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';
import { getRepository } from 'typeorm';
import { EmailUser } from '../../src/db/entity';

describe('/api/loyalty-projects Endpoint Tests', () => {
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

  it('loaylty projects should get status 200', async () => {
    const response = await request(server).get(`/api/loyalty-projects`).set('Authorization', `Bearer ${bearerToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('isShowMore');
    expect(response.body).toHaveProperty('loyaltyProjects');
    expect(response.body).toHaveProperty('projectsTitle');
    expect(response.body).toHaveProperty('searchCount');
  });

  it('loaylty project by link-title should get status 200', async () => {
    const response = await request(server)
      .get(`/api/loyalty-project/link-title-1`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.status).toBe(200);
  });

  // it('loaylty project investor should get status 200', async () => {
  //   const response = await request(server)
  //     .get(`/api/loyalty-project/link-title-1/investor`)
  //     .set('Authorization', `Bearer ${bearerToken}`);
  //   expect(response.status).toBe(200);

  //   expect(response.body).toHaveProperty('rewardsTable');
  //   expect(response.body).toHaveProperty('place');
  //   expect(response.body).toHaveProperty('currentPrizePool');
  //   expect(response.body).toHaveProperty('nextPrizePool');
  //   expect(response.body).toHaveProperty('luckyDraw');
  //   expect(response.body).toHaveProperty('guaranteed');
  // });

  it('loaylty project scoreboard should get status 200', async () => {
    const response = await request(server)
      .get(`/api/loyalty-project/link-title-1/scoreboard?page=1&pageSize=50`)
      .set('Authorization', `Bearer ${bearerToken}`);
    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('eligibleUsersCount');
    expect(response.body).toHaveProperty('luckyDrawWinnersCount');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('pageSize');
    expect(response.body).toHaveProperty('scoreboard');
    expect(response.body).toHaveProperty('total');
  });
});
