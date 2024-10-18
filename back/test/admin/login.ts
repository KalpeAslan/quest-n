import 'jest';
import request from 'supertest';

import { admin } from '../../src/admin/app';

const loginCredentials = {
  login: process.env.ADMIN_LOGIN,
  password: process.env.ADMIN_PASSWORD,
};

describe('/login Endpoint Tests', () => {
  it('login endpoint should get status 200', async () => {
    const res = await request(admin).post('/login').send(loginCredentials);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.token).toBe('string');
  });
});
