import { LoyaltyReward } from '../../db/entity';
import { TokenType } from '../../db/types/interfaces/loyalty';

export const fixNumber = (rawNum: string | number): number => {
  const num = +rawNum;
  return Number.isInteger(num) ? num : +num.toFixed(2);
};

export const exponentToNumber = (x: number | string) => {
  if (Math.abs(Number(x)) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1]);
    if (e) {
      x = Number(x) * Math.pow(10, e - 1);

      x = '0.' + new Array(e).join('0') + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      x = Number(x) / Math.pow(10, e);
      x = Number(x) + new Array(e + 1).join('0');
    }
  }
  return x;
};

export const isWhiteList = (reward: LoyaltyReward) => reward.contract.type === TokenType.Whitelist;

export const getRandomAuthCode = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};
