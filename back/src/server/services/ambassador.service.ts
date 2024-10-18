import { ambassadorModel } from '../../db/models/ambassador.model';
import { NotFoundError, NotFoundErrorKeys } from '../errors/NotFoundError';
import { EAmbassadorMethods } from '../../db/types/interfaces/ambassador.types';

export const findOneAmbassador = async (contact: string, method: EAmbassadorMethods) => {
  contact = method === EAmbassadorMethods.TELEGRAM ? extractTelegramLogin(contact) : contact;
  const ambassador = await ambassadorModel.findByContactAndMethod(contact, method);
  if (!ambassador)
    throw new NotFoundError(NotFoundErrorKeys.NotFound, `Ambassador with contact ${contact} was not found`);
  return ambassador;
};

const extractTelegramLogin = (input: string): string => {
  const regex = /(?:https:\/\/t\.me\/|@)?(\w+)/;
  const match = input.match(regex);

  if (match && match[1]) {
    return match[1];
  } else {
    return input;
  }
};

export const findAllAmbassadors = async (contact: string) => {
  return ambassadorModel.findAll(contact);
};
