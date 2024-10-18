import { useTypedSelector } from "@/hooks/useTypedSelector";
import { Modal } from "../UI/modal";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  setIsAuthPopupOpen,
  setIsReferralCodeLoading,
  setIsReferralPopupResultOpen,
  setLocalReferralCode,
  setQuestReferralCode,
} from "@/modules/account/store/account.slice";
import { Box } from "@mui/material";
import Auth from "../auth/Auth";
import { Button } from "../UI/button";
import { Icon } from "../UI/icon";
import { Wrapper } from "./IframeAuthPopup.styles";
import { useCallback, useEffect, useState } from "react";
import {
  getAccountInfo,
  getLocalReferralCode,
} from "@/modules/account/store/account.selector";
import { Trans, t } from "@lingui/macro";
import classNames from "classnames";
import { useRouter } from "next/router";
import Scroll from "@components/UI/scroll/Scroll";
import { accountApiEndpoints } from "@/modules/account/store/account.api";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { accountService, experienceService } from "@/api";
import { LoggerService } from "@/services";
import { useQuestReferralCode } from "@/hooks/useQuestReferralCode";

const EXCLUDED_TO_SHOW_PATHS = [
  "/login",
  "/sign-up",
  "/verify-email",
  "/reset-password",
];

const IframeAuthPopup = () => {
  const { push, pathname } = useRouter();
  const [authType, setAuthType] = useState<"login" | "sign-up">("sign-up");

  const isAuthPopupOpen = useTypedSelector(
    state => state.account.isAuthPopupOpen,
  );
  const accountInfo = useTypedSelector(getAccountInfo);
  const localReferralCode = useTypedSelector(getLocalReferralCode);
  const questReferralCode = useQuestReferralCode();

  const dispatch = useAppDispatch();

  const computeShowIFrame = () =>
    isAuthPopupOpen && !EXCLUDED_TO_SHOW_PATHS.includes(pathname);

  useEffect(() => {
    if (accountInfo.connected) dispatch(setIsAuthPopupOpen(false));
  }, [accountInfo, dispatch]);

  const verify = async () => {
    try {
      await experienceService.verify();
    } catch (e) {
      LoggerService.error("Error Auth => experienceService.verify", e);
    }
  };

  const computeAuthHeaderEmailText = () => {
    return authType === "sign-up"
      ? t({
          id: "pshNxoKyZ74PEoDVgbtput-quest",
          message: "Sign Up With",
        })
      : t({
          id: "irdCcWq9JEfnf8mHHVrFoG-quest",
          message: "Login With",
        });
  };

  const addReferralCode = useCallback(async () => {
    if (!questReferralCode && !localReferralCode) {
      return;
    }

    try {
      if (localReferralCode) {
        await accountService.postAddReferral({
          code: localReferralCode,
        });
      } else if (questReferralCode && !pathname.includes("login")) {
        await accountService
          .postAddQuestReferral({
            code: questReferralCode,
          })
          .then(res => {
            push(`/quest/${res.data.response.questLinkTitle}`);
          });
      }

      await dispatch(accountApiEndpoints.getUserProfile.initiate(null));
      await verify();

      await dispatch(accountApiEndpoints.getUserAnalyticsInfo.initiate(null));

      dispatch(
        setIsReferralPopupResultOpen({
          open: true,
          type: "success",
        }),
      );
    } catch (error: any) {
      const { response } = error;

      if (
        (response.status === 400 && response.data.errorCode === 1010) ||
        response.data.errorCode === 1011
      ) {
        dispatch(
          setIsReferralPopupResultOpen({
            open: true,
            type: "error",
          }),
        );

        return;
      }

      LoggerService.error("Error during adding referral code", error);
    } finally {
      dispatch(setIsReferralCodeLoading(false));
      dispatch(setLocalReferralCode(null));
      dispatch(setQuestReferralCode(null));
    }
  }, [dispatch, localReferralCode, pathname, push, questReferralCode]);

  const completeAuth = useCallback(async () => {
    await dispatch(accountApiEndpoints.getUserProfile.initiate(null));

    dispatch(
      sendAnalyticsDataThunk({
        type: "signup_complete",
        options: {
          event_property_signup_source: authType,
          event_property_signup_with_referral: false,
        },
      }),
    );
    await verify();

    dispatch(await accountApiEndpoints.getUserAnalyticsInfo.initiate(null));
  }, [authType, dispatch]);

  const handleClose = useCallback(async () => {
    dispatch(setIsAuthPopupOpen(false));

    if (!accountInfo?.connected) {
      await completeAuth();
      await addReferralCode();
    }
  }, [accountInfo?.connected, addReferralCode, completeAuth, dispatch]);

  return (
    <>
      {computeShowIFrame() && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper
            width="90vw"
            maxWidth="360px"
            padding="20px 16px"
            bgcolor="#101313"
            borderRadius="16px"
            position="relative"
          >
            <Scroll>
              <Button
                className="c-font-color closeButton"
                style="icon"
                type="button"
                onClick={handleClose}
                disableTouchStart
              >
                <Icon name="menu-close" size="24" />
              </Button>
              <Box mb={2.5} className="c-font-32-38 c-fw-500 c-font-color">
                {authType === "sign-up" ? (
                  <Trans id="mqkjVkr2JtpMDoVMTW9SkL-quest">
                    Create account
                    <br /> to start task
                  </Trans>
                ) : (
                  <Trans id="kTXrMdpYoUT8DwEvPQuQA7-quest">
                    Login
                    <br /> to start task
                  </Trans>
                )}
              </Box>

              <Auth
                authHeader={
                  <Box mb={2} className="c-font-20-24 c-fw-500 c-font-color">
                    {computeAuthHeaderEmailText()}
                  </Box>
                }
                authFooter={
                  <Box
                    className="c-font-20-24 c-fw-500 c-font-color"
                    component="p"
                    mb={{ xs: 2, md: 3 }}
                  >
                    {authType === "sign-up"
                      ? t({
                          id: "ewbzaoUYwcwgQtsVGsMNfx-onboardingPopup",
                          message: "Already have an account?",
                        })
                      : t({
                          id: "cnN5X8988pYv6LCW2VCNex-onboardingPopup",
                          message: "No account?",
                        })}{" "}
                    <Button
                      style="link"
                      type="button"
                      onClick={() =>
                        setAuthType(
                          authType === "sign-up" ? "login" : "sign-up",
                        )
                      }
                      className={classNames("link", "c-font-color-3")}
                    >
                      {authType === "sign-up"
                        ? t({
                            id: "7zzCf9VsLbLMfN6H2UmmTb-onboardingPopup",
                            message: "Login",
                          })
                        : t({
                            id: "i1TkYYfpQze9ubwdSw6xLx-onboardingPopup",
                            message: "Create one!",
                          })}
                    </Button>
                  </Box>
                }
                emailButtonText={
                  authType === "sign-up"
                    ? t({
                        id: "qhDqBGf6kLUBTTXbKjZi8e-quest",
                        message: "Sign up via Email or Phone",
                      })
                    : t({
                        id: "3hNyVUWtBR5KP4GMjngf7a-quest",
                        message: "Login via Email or Phone",
                      })
                }
                twitterButtonText={t({
                  id: "rA42SJ8dPTGduGa1HpjMz2-quest",
                  message: "Twitter",
                })}
                discordButtonText=""
                googleButtonText={t({
                  id: "3WPNu2JjjNHwqz4WADB9Y5-quest",
                  message: "Google",
                })}
                authFlow={authType}
                iframeAuthPopup
              />
            </Scroll>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default IframeAuthPopup;
