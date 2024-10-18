import { LoyaltyProjectTokensEarnRule } from '../../../db/entity';

export const getAQTokenRewardByPlace = (
  rulesTable: LoyaltyProjectTokensEarnRule[],
  place: number,
  tokensAmount: number,
): number => {
  let rewardPerPlace = 0;
  const currentRule = rulesTable.find((rule) => rule.startPlace <= place && rule.endPlace >= place);
  if (currentRule) {
    const numberOfPlaces = currentRule.endPlace - currentRule.startPlace + 1;
    const tokenAmountForRule = parseFloat((tokensAmount * (currentRule.profit / 100)).toFixed(2));
    rewardPerPlace = parseFloat((tokenAmountForRule / numberOfPlaces).toFixed(2));
  }

  return rewardPerPlace;
};
