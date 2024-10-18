import { Box } from "@mui/material";
import classnames from "classnames";

import { Info } from "@modules/account/components/info";
import { StickyBar } from "@modules/account/components/stickyBar";
import { Blocks } from "@modules/account/components/blocks";
import { ReferralWrapper } from "./referral.styles";
import { useEffect, useState } from "react";
import { Trans } from "@lingui/macro";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { useGetUserReferralQuery } from "@modules/account/store/account.api";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import Loader from "@components/UI/loader/Loader";

const ReferralPage = () => {
  const dispatch = useAppDispatch();

  const [tracked, setTracked] = useState(false);
  const accountInfo = useTypedSelector(getAccountInfo);
  const { data, isLoading } = useGetUserReferralQuery(null, {
    skip: !accountInfo.connected,
  });

  useEffect(() => {
    if (tracked) return;

    dispatch(
      sendAnalyticsDataThunk({
        type: "referral_screen_view",
        options: { event_property_current_page: "/referral" },
      }),
    );
    setTracked(true);
  }, [dispatch, tracked]);

  return (
    <div className="background-other">
      <ReferralWrapper mt={5} mb={5}>
        {!isLoading ? (
          <>
            <Box
              className={classnames(
                "header",
                "c-font-32-38 c-fw-500 c-font-color",
              )}
              component="h3"
              mb={{ xs: 0.5, md: 1.5 }}
            >
              <Trans id="9SscYTDvghUzTeVqpo3ExJ-account">Referral</Trans>
            </Box>

            <Box className="sticky">
              <StickyBar />
            </Box>

            <Box className="info">
              <Info />
            </Box>

            <Box className="blocks">
              <Blocks />
            </Box>
          </>
        ) : (
          <Loader />
        )}
      </ReferralWrapper>
    </div>
  );
};

export default ReferralPage;
