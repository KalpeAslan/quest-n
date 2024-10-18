import request from 'supertest';
import { dbConnection } from '../testDb';
import { admin } from '../../src/admin/app';

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

  it('POST Partner', async () => {
    const response = await request(admin)
      .post(`/admin/partner`)
      .send({
        title: 'Gotbit',
        description: 'Investment partner',
        image: 'hj1rhpOVoZ.png',
        link: 'https://go.alphaguilty.io/partnerGotbit',
        status: true,
        priorityNumber: 1,
      })
      .set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });

  it('GET Partner', async () => {
    const response = await request(admin).get(`/admin/partner`).set('Authorization', `Bearer ${bearerToken}`);

    expect(response.status).toBe(200);
  });
});
