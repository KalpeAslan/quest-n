import { investorModel } from '../../db/models/investorModel';
import { UnauthorizedError, UnauthorizedErrorKeys } from '../errors';
import { verifyAccessToken } from '../services/entry/jwt';

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) next(new UnauthorizedError(UnauthorizedErrorKeys.WrongToken, 'wrong token'));
  const { investorId } = verifyAccessToken(token);

  if (!investorId) next(new UnauthorizedError(UnauthorizedErrorKeys.WrongToken, 'wrong token'));
  const investor = await investorModel.getByInvestorId(investorId);
  if (!investor) next(new UnauthorizedError(UnauthorizedErrorKeys.WrongToken, 'wrong token'));

  next();
};
