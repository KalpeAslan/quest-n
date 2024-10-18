import { useMemo } from "react";
import { Box } from "@mui/system";
import classnames from "classnames";
import { DateTime } from "luxon";
import { Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import { CustomAreaChart } from "@components/UI/charts/area";
import { IReferralInfoHistory } from "@modules/account/models";
import { ReferralIncomeMonthWrapper } from "./referralIncomeMonth.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";

const ReferralIncomeMonth = () => {
  const accountInfo = useTypedSelector(getAccountInfo);

  const avarageByMounth = useMemo(() => {
    if (accountInfo?.referralInfo?.referralProfitByMonth?.averageByMonth) {
      return accountInfo.referralInfo.referralProfitByMonth?.averageByMonth;
    }

    return 0;
  }, [accountInfo]);

  const referralIncomeByMounth = useMemo(() => {
    if (
      accountInfo?.referralInfo?.referralProfitByMonth?.referralProfitByMonth &&
      Array.isArray(
        accountInfo?.referralInfo?.referralProfitByMonth?.referralProfitByMonth,
      )
    ) {
      const data =
        accountInfo.referralInfo.referralProfitByMonth.referralProfitByMonth.map(
          (item: IReferralInfoHistory) => ({
            name: DateTime.fromISO(`${item.createdAt}`)
              .toUTC()
              .toFormat(`${"MMM"}`),
            value: item.amount,
          }),
        );

      return data;
    }

    return [];
  }, [accountInfo]);

  return (
    <ReferralIncomeMonthWrapper>
      <Box component="header" className="header" mb={1.5}>
        <p className="c-font-14-20 c-font-color">
          <Trans id="2SaXnHP3uvHyAWdV8vs9Eu-account">
            Referral Income by Month
          </Trans>
        </p>
      </Box>

      <Box className="cont" mb={1}>
        <p
          className={classnames(
            "title",
            "c-font-grad c-font-32-36 c-inline-block",
          )}
        >
          {avarageByMounth} AQ{" "}
          <Box component="span" className="c-font-12-16" ml={0.5}>
            <Trans id="mEiocuFBrPgLrYjvZn7syn-account">average/month</Trans>
          </Box>
        </p>
      </Box>

      {referralIncomeByMounth.length === 0 ? (
        <Box ml={-0.5} mb={1} className="dec">
          <Icon
            name="empty-graph"
            width="302"
            height="106"
            style={{ maxWidth: "100%" }}
          />
        </Box>
      ) : (
        <CustomAreaChart
          data={referralIncomeByMounth}
          xDataKey="name"
          yDataKey="value"
          height={136}
          label="AQ"
          xTickLine={false}
          yTickLine={false}
          mirrorY={false}
          isLoaded={true}
        />
      )}
    </ReferralIncomeMonthWrapper>
  );
};

export default ReferralIncomeMonth;
