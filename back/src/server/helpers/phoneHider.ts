import { parsePhoneNumber } from 'awesome-phonenumber';

export const phoneHider = (phoneNumber: string) => {
  const pn = parsePhoneNumber(phoneNumber);

  const significant = pn.number?.significant;
  if (!significant || !pn.countryCode) return phoneNumber;

  const middlePartOfNumber = significant.substring(0, significant.length - 2) || significant;
  return String('+' + pn.countryCode + significant.replace(middlePartOfNumber, '*'.repeat(middlePartOfNumber.length)));
};

export const phoneEndHider = (phoneNumber: string) => {
  const firstPartOfNumber = phoneNumber.substring(0, phoneNumber.length - 4);
  return phoneNumber.replace(firstPartOfNumber, '*'.repeat(firstPartOfNumber.length));
};
