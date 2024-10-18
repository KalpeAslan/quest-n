//to Mock referralIncomeByMounth,currentReferralRank, monthlyReferralVolume
export const referralInfoMock = {
  referralIncomeByMounth: {
    avarageByMounth: 0,
    referralIncomeByMounth: [],
  },
  currentReferralRank: {
    nextRanks: [
      {
        tokensFrom: 1000,
        name: 'A',
        profit: 5,
      },
      {
        tokensFrom: 3000,
        name: 'B',
        profit: 7,
      },
      {
        tokensFrom: 5000,
        name: 'C',
        profit: 9,
      },
    ],
    allRanks: [
      {
        id: 1,
        name: 'N',
        tokensFrom: 0,
        profit: 0,
      },
      {
        id: 2,
        name: 'A',
        tokensFrom: 1000,
        profit: 5,
      },
      {
        id: 3,
        name: 'B',
        tokensFrom: 3000,
        profit: 7,
      },
      {
        id: 4,
        name: 'C',
        tokensFrom: 5000,
        profit: 9,
      },
      {
        id: 5,
        name: 'D',
        tokensFrom: 10000,
        profit: 11,
      },
      {
        id: 6,
        name: 'E',
        tokensFrom: 25000,
        profit: 13,
      },
      {
        id: 7,
        name: 'F',
        tokensFrom: 50000,
        profit: 15,
      },
      {
        id: 8,
        name: 'G',
        tokensFrom: 75000,
        profit: 17,
      },
      {
        id: 9,
        name: 'H',
        tokensFrom: 125000,
        profit: 19,
      },
      {
        id: 10,
        name: 'I',
        tokensFrom: 150000,
        profit: 21,
      },
      {
        id: 11,
        name: 'J',
        tokensFrom: 300000,
        profit: 23,
      },
      {
        id: 12,
        name: 'K',
        tokensFrom: 500000,
        profit: 25,
      },
    ],
    referralRankReachedVolume: 0,
    currentRank: {
      tokensFrom: 0,
      name: 'N',
      profit: 0,
    },
    volumeForNextRank: 1000,
  },
  monthlyReferralVolume: {
    monthlyReferralVolume: 0,
    currentProfit: 0,
    monthlyGroupVolume: 0,
    referralTotal: 0,
    ranksTotal: 0,
    referralsByRanks: [],
  },
};
