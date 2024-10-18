import { verify } from 'jsonwebtoken';

export const parseAuthToken = (authorization: string | undefined, secret: string) => {
  if (authorization) {
    const token = authorization.split(' ')[1];

    if (token) {
      return verify(token, secret);
    }
  }

  return {};
};
