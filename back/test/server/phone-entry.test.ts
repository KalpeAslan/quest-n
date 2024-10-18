import 'jest';
import request from 'supertest';
import { server } from '../../src/server/app';
import { dbConnection } from '../testDb';
import { phoneUserModel } from '../../src/db/models/phoneUserModel';

jest.mock('../../src/server/services/apis/sendGridApiService.ts', () => {
  return {
    sendCode(phoneNumber: string) {
      return `message sent to ${phoneNumber}`;
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
    phone: '+380123123',
    password: 'password',
    referralCode: '',
    redirect: '',
  },
  {
    phone: '+380654321',
    password: 'password',
    referralCode: '',
    redirect: '',
  },
  {
    phone: '+380123123',
    password: 'password',
    referralCode: '',
    redirect: '',
  },
];

describe('test phone registration endpoint', () => {
  beforeAll(async () => {
    await dbConnection();
    await phoneUserModel.deleteAll();
  });

  it('Create user with phone', async () => {
    const res = await request(server)
      .post(`/api/auth/register/phone`)
      .send(emailUserBody[0])
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
  });

  test('Create user with phone', async () => {
    const res = await request(server)
      .post(`/api/auth/register/phone`)
      .send(emailUserBody[1])
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
  });

  // Duplicate user test should be created, but server logic is not working
});
