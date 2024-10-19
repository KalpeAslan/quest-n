import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { useRouter } from "next/router";
import { Auth } from "@components/auth";
import { AppContext } from "@context";
import { LoginWrapper } from "./login.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { getLoginPrevLocation } from "@store/slices/system/system.selector";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import Link from "next/link";
import classnames from "classnames";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { LocalStorageService } from "@/services";

const LoginPage = () => {
  const { push, pathname, query } = useRouter();

  const dispatch = useAppDispatch();

  const accountInfo = useTypedSelector(getAccountInfo);
  const loginPrevLocation = useTypedSelector(getLoginPrevLocation);

  const [tracked, setTracked] = useState(false);

  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );

  useEffect(() => {
    console.log("accountInfo?.connected", accountInfo?.connected);
    if (accountInfo?.connected) {
      const localStoragePrevLocation =
        LocalStorageService.getItem("prev_location");
      LocalStorageService.removeItem("prev_location");
      console.log("accountInfo?.connected inner", accountInfo?.connected);
      // push(loginPrevLocation || localStoragePrevLocation || "/");
    }
  }, [accountInfo?.connected, loginPrevLocation, push, pathname]);

  useEffect(() => {
    return () => {
      if (prevLocation) {
        prevLocation.current = location.pathname;
      }
    };
  }, []);

  useEffect(() => {
    if (tracked) return;

    dispatch(
      sendAnalyticsDataThunk({
        type: "login_screen_view",
        options: { event_property_current_page: "/login" },
      }),
    );
    setTracked(true);
  }, [dispatch, tracked]);

  return (
    <div className="background-other">
      <LoginWrapper mt={5} mb={5}>
        <Auth
          wallet={query.wallet === "true"}
          authHeader={
            <Box
              className="c-font-24-26 c-sm-font-32-38 c-fw-500 c-font-color"
              component="h3"
              mb={{ xs: 1 }}
              sx={{ textAlign: "left" }}
            >
              <Trans id="prYrDvTiVsiL3Bm9htyU75-account">Welcome</Trans>
            </Box>
          }
          authFooter={
            <Box className="c-font-20-24 c-fw-500 c-font-color" component="p">
              <Trans id="wzNSJvd6aAJYWL1Xd9Gf1t-account">No account?</Trans>{" "}
              <Link
                href="/sign-up"
                className={classnames("link", "c-font-color-3")}
              >
                <Trans id="f6hX6MSaRQYk6BadCAkmvH-account">Create one</Trans>
              </Link>
            </Box>
          }
        />
      </LoginWrapper>
    </div>
  );
};

export default LoginPage;
