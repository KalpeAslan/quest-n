import request from 'supertest';
import { dbConnection } from '../testDb';
import { admin } from '../../src/admin/app';
import { partnerProjectModel } from '../../src/db/models';

const loginCredentials = {
  login: process.env.ADMIN_LOGIN,
  password: process.env.ADMIN_PASSWORD,
};

describe('/admin/partner-project/ Endpoint Tests', () => {
  let bearerToken;
  beforeAll(async () => {
    await dbConnection();

    const loginResponse = await request(admin).post('/login').send(loginCredentials).set('Accept', 'application/json');

    bearerToken = loginResponse['_body'].token;
    console.log('bearerToken', bearerToken);
  });

  it('should get a user by ID', async () => {
    const response = await request(admin)
      .post(`/admin/partner-project`)
      .send({
        name: 'Crypto Hunters',
        logo: '7bvlVHqQjq.svg+xml',
        verificationIcon: true,
        linkTitle: 'crypto-hunters-3',
        projectDescription: '',
        socialDescription: ':abbr[{',
        localizationId: '',
        shortDescription:
          'Powerful one-click transactions, unbeatably capital-efficient AMMs, and a modular developer experience.',
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('get all partner projects should get status 200', async () => {
    const response = await request(admin).get(`/admin/partner-project`).set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('delete single partner project should get status 200', async () => {
    const partnerProjects = await partnerProjectModel.getAll();
    const response = await request(admin)
      .delete(`/admin/partner-project/${partnerProjects[partnerProjects.length - 1].id}`)
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });
});
