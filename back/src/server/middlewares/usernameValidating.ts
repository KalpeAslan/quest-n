import { NotFoundError, NotFoundErrorKeys } from '../errors/NotFoundError';

export const userNameValidating = (req, res, next) => {
  const { username } = req.body;
  const usernameRegex = /^[a-zA-Z0-9-._ ]{1,24}$/;
  if (usernameRegex.test(username)) {
    next();
  } else {
    next(new NotFoundError(NotFoundErrorKeys.NotFound, 'Username is not valid'));
  }
};
