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
      .post('/api/entry/login/email')
      .send({
        email: emailUser?.email,
        password: 'securepassword1',
      })
      .set('Accept', 'application/json');

    bearerToken = loginResponse['_body'].accessToken;
  });

  //   it('POST project, should get status 200', async () => {
  //         const response = await request(server)dsad
  //       .post(`/api/admin/loyalty/project`)
  //       .send({
  //         name: 'kairat-test-18-aug',
  //         linkTitle: 'kairat-test-18-aug',
  //       })
  //       .set('Authorization', `Bearer ${bearerToken}`);

  //     expect(response.status).toBe(200);
  //     expect(response.body).toHaveProperty('project');
  //   });

  //   it('POST quest, should get status 200', async () => {
  //     const response = await request(server)
  //       .post(`/api/admin/loyalty/quest`)
  //       .send({
  //         projectName: 'dsdsa',
  //         linkTitle: 'dsdsa',
  //         shortDescription: 'dsadsadsa',
  //         projectDescription: 'dsadsadsa',
  //         startAt: '2023-08-17T08:47:53.297Z',
  //         endAt: '2023-08-18T08:47:53.297Z',
  //         partnerLinkTitle: 'kairat-test-18-aug',
  //         socialDescription: ':abbr[]',
  //         title: 'dsdsa',
  //         previewImage: '6mVCvffyy_.jpeg',
  //         projectType: 'scoreboard',
  //       })
  //       .set('Authorization', `Bearer ${bearerToken}`);

  //     expect(response.status).toBe(200);
  //     expect(response.body).toHaveProperty('eligibleUsersCount');
  //     expect(response.body).toHaveProperty('endAt');
  //     expect(response.body).toHaveProperty('featured');
  //     expect(response.body).toHaveProperty('fullRewards');
  //     expect(response.body).toHaveProperty('id');
  //     expect(response.body).toHaveProperty('linkTitle');
  //   });
});
