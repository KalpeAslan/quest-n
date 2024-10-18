import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';
import { getRepository } from 'typeorm';
import { EmailUser } from '../../src/db/entity';

describe('/api/admin/project Endpoint Tests', () => {
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

  it('Create quest with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest`)
      .send({
        partnerLinkTitle: 'partnerProject-one',
        socialDescription:
          ':abbr[{"twitter":"","discord":"","telegram":"","projectSite":"https://dev.alphaguilty.com/admin/project/create"}]',
        title: 'quest-scoreboard',
        previewImage: null,
        projectType: 'scoreboard',
        projectName: 'quest-scoreboard',
        description: 'some description',
        linkTitle: 'quest-scoreboard',
        startAt: '2023-12-01T09:31:50.968Z',
        endAt: '2023-12-15T09:31:50.968Z',
        questStatus: 'Draft',
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('visible');
    expect(response.body).toHaveProperty('threshold');
    expect(response.body).toHaveProperty('projectType');
    expect(response.body).toHaveProperty('rewards');
    expect(response.body).toHaveProperty('title');

    expect(response.body.description).toEqual('some description');
    expect(response.body.visible).toEqual(false);
    expect(response.body.threshold).toEqual(null);
    expect(response.body.projectType).toEqual('scoreboard');
    expect(response.body.rewards).toEqual({ tokens: [] });
    expect(response.body.title).toEqual('quest-scoreboard Quest');
  });

  it('Update quest with user admin', async () => {
    const response = await request(server)
      .put(`/api/admin/quest/quest-scoreboard-quest`)
      .send({
        projectName: 'test-integration Quest',
        description: '<p>some description</p>',
        linkTitle: 'test-integration-quest-5kvlx56p',
        startAt: '2023-12-01T11:00:34.078Z',
        endAt: '2023-12-15T11:00:34.078Z',
        title: 'test-integration Quest',
        threshold: 10,
        projectType: 'luckyDraw',
        socialDescription:
          ':abbr[{"twitter":"","discord":"","telegram":"","projectSite":"https://dev.alphaguilty.com/admin/project/create"}]',
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('visible');
    expect(response.body).toHaveProperty('threshold');
    expect(response.body).toHaveProperty('projectType');
    expect(response.body).toHaveProperty('rewards');
    expect(response.body).toHaveProperty('title');

    expect(response.body.threshold).toEqual(10);
    expect(response.body.projectType).toEqual('luckyDraw');
  });

  it('Update quest with user admin', async () => {
    const response = await request(server)
      .put(`/api/admin/quest/test-integration-quest-5kvlx56p`)
      .send({
        projectType: 'scoreboard',
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);

    expect(response.body.projectType).toEqual('scoreboard');
  });

  it('Create second quest with user admin', async () => {
    const response = await request(server)
      .post(`/api/admin/quest`)
      .send({
        partnerLinkTitle: 'partnerProject-one',
        socialDescription:
          ':abbr[{"twitter":"","discord":"","telegram":"","projectSite":"https://dev.alphaguilty.com/admin/project/create"}]',
        title: 'quest-scoreboard',
        previewImage: null,
        projectType: 'scoreboard',
        projectName: 'quest-scoreboard',
        description: 'some description',
        linkTitle: 'quest-scoreboard-second',
        startAt: '2023-12-01T09:31:50.968Z',
        endAt: '2023-12-15T09:31:50.968Z',
        questStatus: 'Draft',
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('Get second quest with user admin', async () => {
    const response = await request(server)
      .get(`/api/loyalty-project/quest-scoreboard-second-quest`)
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('Check getAdminTasksSettings endpoint', async () => {
    const response = await request(server)
      .get(`/api/admin/quest/getAdminTasksSettings`)
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('tgBotLink');
    expect(response.body).toHaveProperty('questsCount');

    expect(response.status).toBe(200);
  });

  it('Delete second quest with user admin', async () => {
    const response = await request(server)
      .delete(`/api/admin/quest/quest-scoreboard-second-quest`)
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });
});
