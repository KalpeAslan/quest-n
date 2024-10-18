import { useMemo } from "react";

import { LoginInfo } from "./components/loginInfo";
import { ReferralIncomeMonth } from "./components/referralIncomeMonth";
import { MonthlyReferralVolume } from "./components/monthlyReferralVolume";

import { CurrentReferralRank } from "./components/currentReferralRank";
import { BestReferrals } from "./components/bestReferrals";
import { BlocksLeft, BlocksRight } from "./blocks.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";

const Blocks = () => {
  const accountInfo = useTypedSelector(getAccountInfo);

  const referralTotal = useMemo(() => {
    if (
      accountInfo?.referralInfo?.referralsCount &&
      accountInfo?.referralInfo?.referralsCount > 0
    ) {
      return accountInfo.referralInfo.referralsCount;
    }

    return 0;
  }, [accountInfo]);

  return (
    <>
      {referralTotal === 0 ? (
        <>
          <LoginInfo />

          <BestReferrals />
        </>
      ) : (
        <>
          <BlocksLeft>
            <CurrentReferralRank />

            <ReferralIncomeMonth />
          </BlocksLeft>

          <BlocksRight>
            <MonthlyReferralVolume />
          </BlocksRight>
        </>
      )}
    </>
  );
};

export default Blocks;
