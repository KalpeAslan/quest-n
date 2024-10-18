import 'jest';
import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';
import { emailUserModel } from '../../src/db/models/emailUserModel';
import { main } from '../population/populateAll';

jest.mock('../../src/server/services/apis/sendGridApiService.ts', () => {
  return {
    sendGridApiService: {
      sendToken(to: string, token: string) {
        return `message to ${to} with ${token}`;
      },
    },
  };
});

jest.mock('../../src/server/services/referralProfile', () => {
  return {
    validateReferralCode(code: string) {
      return true;
    },
  };
});

const emailUserBody = [
  {
    email: 'talantbekov123@gmail.com',
    password: 'password',
    referralCode: '',
    redirect: '',
  },
  {
    email: 'kairatbish@gmail.com',
    password: 'password',
    referralCode: '',
    redirect: '',
  },
  {
    email: 'talantbekov123@gmail.com',
    password: 'password',
    referralCode: '',
    redirect: '',
  },
];

describe('test email registration endpoint', () => {
  beforeAll(async () => {
    await dbConnection();
  });

  it('Create user with email', async () => {
    const res = await request(server)
      .post(`/api/auth/register/email`)
      .send(emailUserBody[0])
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
  });

  test('Create user with email', async () => {
    const res = await request(server)
      .post(`/api/auth/register/email`)
      .send(emailUserBody[1])
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
  });

  // Duplicate user test should be created, but server logic is not working
});
