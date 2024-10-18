import * as bcrypt from 'bcrypt';
import { countLoginConnections } from '.';
import { phoneUserModel } from '../../../db/models';
import { BadRequestError, BadRequestErrorKeys, NotFoundError, NotFoundErrorKeys } from '../../errors';
import { ChangePasswordDto } from '../../../db/types/interfaces/entry/changePasswordDto';

export const phoneDisconnectUserService = async (investorId: number) => {
  const phoneUser = await phoneUserModel.getByInvestorId(investorId);
  if (!phoneUser) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'User does not have phone data');

  const countConnections = await countLoginConnections(investorId);

  if (countConnections === 1) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'You cannot disable the only login method');
  }

  await phoneUserModel.deleteByInvestorId(investorId);
};

export const phoneChangePasswordService = async (changePasswordDto: ChangePasswordDto, investorId: number) => {
  const phoneUser = await phoneUserModel.getByInvestorId(investorId);
  if (!phoneUser) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'User does not have email data');

  const isPasswordMatch = await bcrypt.compare(changePasswordDto.oldPassword, phoneUser.password);
  if (!isPasswordMatch) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Invalid password');
  }

  const password = await bcrypt.hash(changePasswordDto.newPassword, 10);

  await phoneUserModel.update({ ...phoneUser, password });
};
