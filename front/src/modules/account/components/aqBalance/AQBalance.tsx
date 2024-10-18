import { AlphaguiltyIncome } from "./components/alphaguiltyIncome";
import { AlphaLoyaltyIncome } from "./components/alphaloyaltyIncome";
import { AvailableReferralIncome } from "./components/availableReferralIncome";
import { LeftWrapper, RightWrapper } from "./aqBalance.styles";
import { IAccount } from "@modules/account/models";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { Referral } from "@modules/account/components/settings/components/personalInfo/components/referral";

const AQBalance = () => {
  const accountInfo: IAccount = useTypedSelector(getAccountInfo);

  return (
    <>
      <LeftWrapper mb={{ xs: 1.5, md: 0 }}>
        <AlphaguiltyIncome />
        <AlphaLoyaltyIncome />
      </LeftWrapper>

      <RightWrapper>
        <AvailableReferralIncome />

        {accountInfo?.referrerCode &&
          !accountInfo.referrerCode.referrer_code && <Referral />}
      </RightWrapper>
    </>
  );
};

export default AQBalance;
