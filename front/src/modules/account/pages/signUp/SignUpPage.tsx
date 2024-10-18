import { useEffect, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { useRouter } from "next/router";

import { Auth } from "@components/auth";
import { AppContext } from "@context";
import { SignUpWrapper } from "./signUp.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getAccountState } from "@modules/account/store/account.selector";
import { Box } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import Link from "next/link";
import classnames from "classnames";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { getLoginPrevLocation } from "@/store/slices/system/system.selector";
import { LocalStorageService } from "@/services";

const SignUpPage = () => {
  const { push } = useRouter();

  const dispatch = useAppDispatch();

  const { accountInfo } = useTypedSelector(getAccountState);
  const loginPrevLocation = useTypedSelector(getLoginPrevLocation);

  const [tracked, setTracked] = useState(false);

  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );

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
        type: "signup_screen_view",
        options: { event_property_current_page: "/sign-up" },
      }),
    );

    setTracked(true);
  }, [dispatch, tracked]);

  useEffect(() => {
    console.log("signup accountInfo?.connected", accountInfo?.connected);
    if (accountInfo?.connected) {
      const localStoragePrevLocation =
        LocalStorageService.getItem("prev_location");
      LocalStorageService.removeItem("prev_location");
      console.log(
        "signup accountInfo?.connected inner",
        accountInfo?.connected,
      );
      push(loginPrevLocation || localStoragePrevLocation || "/");
    }
  }, [accountInfo?.connected, loginPrevLocation, push]);

  return (
    <div className="background-other">
      <SignUpWrapper mt={5} mb={5}>
        <Auth
          authHeader={
            <Box
              className="c-font-24-26 c-sm-font-32-38 c-fw-500 c-font-color"
              component="h3"
              mb={2.5}
            >
              <Trans id="3CbJYwUpHx4yn58AtQWNJR-account">Join AlphaQuest</Trans>
            </Box>
          }
          twitterButtonText={t({
            id: "4PTERtb3xuz2MeYrzzFmzd-account",
            message: "Twitter",
          })}
          discordButtonText={t({
            id: "kh31Jfu1tk1BqfbRFLnCHJ-account",
            message: "Discord",
          })}
          googleButtonText={t({
            id: "mxRGdukpDuzC7zTfqDykXF-account",
            message: "Google",
          })}
          emailButtonText={t({
            id: "buwXZrSAZHG8MdN3jGo8AT-account",
            message: "Sign Up via Email or Phone",
          })}
          authFooter={
            <Box
              className="c-font-20-24 c-fw-500 c-font-color"
              component="p"
              mb={{ xs: 2, md: 3 }}
            >
              <Trans id="32R9DB7H2XbtMzaryQMVjB-account">
                Already have an account?
              </Trans>{" "}
              <Link
                href="/login"
                className={classnames("link", "c-font-color-3")}
              >
                <Trans id="3nuW9fcMedjq49uGPQeoXC-account">Login</Trans>
              </Link>
            </Box>
          }
        />
      </SignUpWrapper>
    </div>
  );
};

export default SignUpPage;
