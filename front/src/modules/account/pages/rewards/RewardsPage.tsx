import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";
import classnames from "classnames";
import { Box, Theme, useMediaQuery } from "@mui/material";

import { AppContext } from "@context";
import { useRouter } from "next/router";
import { RewardsPageStyles } from "./rewardsPage.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountState } from "@modules/account/store/account.selector";
import dynamic from "next/dynamic";
import { NextPage } from "next";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { Trans } from "@lingui/macro";
import {
  useGetUserAnalyticsInfoQuery,
  useGetUserProfileQuery,
} from "@modules/account/store/account.api";
import { PageLoader } from "@/components/pageLoader";
import { CBreakpoints } from "@styles/variables";
import Rewards from "../../components/rewards/Rewards";
import { usePrivateRouteRedirect } from "@/hooks/usePrivateRouteRedirect";

const AccountBarLazy = dynamic(
  () =>
    import("@modules/account/components/accountBar").then(
      res => res.AccountBar,
    ),
  {
    ssr: false,
    loading: () => <PageLoader />,
  },
);

const RewardsPage: NextPage = () => {
  const { replace } = useRouter();

  const dispatch = useAppDispatch();

  const { accountInfo, isAccountLoaded } = useTypedSelector(getAccountState);

  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );

  const [tracked, setTracked] = useState(false);

  useGetUserProfileQuery(null, {
    skip: !accountInfo.connected,
  });
  useGetUserAnalyticsInfoQuery(null, {
    skip: !accountInfo.connected,
  });

  useEffect(() => {
    return () => {
      if (prevLocation) {
        prevLocation.current = location.pathname;
      }
    };
  }, []);

  useEffect(() => {
    if (!isAccountLoaded || tracked) return;

    dispatch(
      sendAnalyticsDataThunk({
        type: "account_screen_view",
        options: { event_property_current_page: "/profile/rewards" },
      }),
    );
    setTracked(true);
  }, [isAccountLoaded, dispatch, accountInfo, tracked]);

  usePrivateRouteRedirect();

  const isMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.md),
  );

  return (
    <div className="background-other">
      <RewardsPageStyles mt={5} mb={isMd ? 16 : 5}>
        <Box mb={{ xs: 2, md: 3 }}>
          <Box
            className={classnames(
              "header",
              "c-font-32-38 c-fw-500 c-font-color",
            )}
            component="h3"
          >
            <Trans id={"jdshfjk-234hkjdf"}>Rewards</Trans>
          </Box>
          <p className={"c-font-16-18 c-font-color"}>
            <Trans id="nd6Bs8KUpoqsLAukzP1DwX-rewards">
              Here are the rewards you won in quests.
            </Trans>
          </p>
        </Box>

        <Box className="sticky">
          <AccountBarLazy />
        </Box>

        <Box className="blocks" alignItems={"start"} justifyContent={"center"}>
          <Rewards />
        </Box>
      </RewardsPageStyles>
    </div>
  );
};

export default RewardsPage;
