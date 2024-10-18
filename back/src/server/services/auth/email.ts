import * as bcrypt from 'bcrypt';
import { countLoginConnections } from '.';
import { emailUserModel } from '../../../db/models';
import { ChangePasswordDto } from '../../../db/types/interfaces/entry/changePasswordDto';
import { BadRequestError, BadRequestErrorKeys, NotFoundError, NotFoundErrorKeys } from '../../errors';

export const emailDisconnectUserService = async (investorId: number) => {
  const emailUser = await emailUserModel.getByInvestorId(investorId);
  if (!emailUser) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'User does not have email data');

  const countConnections = await countLoginConnections(investorId);

  if (countConnections === 1) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'You cannot disable the only login method');
  }

  await emailUserModel.deleteByInvestorId(investorId);
};

export const emailChangePasswordService = async (changePasswordDto: ChangePasswordDto, investorId: number) => {
  const emailUser = await emailUserModel.getByInvestorId(investorId);
  if (!emailUser) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'User does not have email data');

  const isPasswordMatch = await bcrypt.compare(changePasswordDto.oldPassword, emailUser.password);
  if (!isPasswordMatch) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Invalid password');
  }

  const password = await bcrypt.hash(changePasswordDto.newPassword, 10);

  await emailUserModel.update({ ...emailUser, password });
};
