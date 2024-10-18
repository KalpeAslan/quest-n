import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";
import classnames from "classnames";
import { Box, Theme, useMediaQuery } from "@mui/material";

import { AppContext } from "@context";
import { useRouter } from "next/router";
import { AccountsAndSecurityStyles } from "./accountsAndSecurity.styles";
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
import { usePrivateRouteRedirect } from "@/hooks/usePrivateRouteRedirect";

const SettingsLazy = dynamic(
  () =>
    import("@modules/account/components/settings").then(res => res.Settings),
  {
    ssr: false,
    loading: () => <PageLoader />,
  },
);

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

const AccountsAndSecurity: NextPage = () => {
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
        options: { event_property_current_page: "/profile/security" },
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
      <AccountsAndSecurityStyles mt={5} mb={isMd ? 16 : 5}>
        <Box
          className={classnames("header", "c-font-32-38 c-fw-500 c-font-color")}
          component="h3"
          mb={{ xs: 2, md: 3 }}
        >
          <Trans id="xaGERQNbnHmCsZnHH2RkZLX-account">
            Accounts & Security
          </Trans>
        </Box>

        <Box className="sticky">
          <AccountBarLazy />
        </Box>

        <Box className="blocks">
          <SettingsLazy />
        </Box>
      </AccountsAndSecurityStyles>
    </div>
  );
};

export default AccountsAndSecurity;
