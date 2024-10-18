import { BaseInvitePartnerProjectPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/BaseInvitePartnerProjectPopup";
import { Box } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import Button from "@components/UI/button/Button";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import {
  IAccount,
  SuccessfulEntryResponse,
  TSocialAuthType,
} from "@modules/account/models";
import { InviteToPartnerProjectPopupStyles } from "@modules/quest/components/inviteToPartnerProjectPopup/InviteToPartnerProjectPopup.styles";
import { useEffect, useState } from "react";
import { adminProjectService, entryService, experienceService } from "@api";
import {
  IInviteInfoForPartnerProject,
  TSocialDataType,
  TWalletEntry,
} from "@models";
import classnames from "classnames";
import { GoogleLogin } from "@components/socialsLogin/google";
import {
  setIsRestrictionForCreationPopupOpen,
  setIsSocialAuthLoaded,
} from "@modules/account/store/account.slice";
import { HelperService, LocalStorageService, LoggerService } from "@services";
import { sendAnalyticsDataThunk } from "@store/slices/analytics/analytics.thunks";
import { forceScrollRerender } from "@store/slices/system/system.slice";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { countConvs } from "@/lib/evaDav";
import { useRouter } from "next/router";

export const AcceptPartnerPAcceptPartnerProjectNotConnectedPopup = () => {
  const accountInfo = useTypedSelector(getAccountInfo) as IAccount;
  const [invite, setInvite] = useState<IInviteInfoForPartnerProject>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inviteId, setInviteId] = useState<string>("" as string);

  const { pathname } = useRouter();
  const onClose = () => {
    setIsOpen(false);
  };
  // useSocialCallback();

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    setInviteId(params.get("inviteToPartnerProjectId"));
  }, []);

  useEffect(() => {
    const isNotAuthPage =
      !(pathname === "/inviteToPartnerProjectLogin" ||
      pathname === "/inviteToPartnerProjectSignUp");
    if (
      !LocalStorageService.accessToken &&
      !accountInfo.connected &&
      inviteId &&
      isNotAuthPage
    ) {
      setIsOpen(true);
    }
  }, [accountInfo, inviteId, pathname]);

  useEffect(() => {
    if (isOpen) {
      adminProjectService
        .getInviteById(inviteId as string)
        .then(res => setInvite(res.data));
    }
  }, [isOpen, inviteId]);

  const dispatch = useAppDispatch();

  const isSignUp = invite ? invite.flow === "signUp" : true;

  const verify = async () => {
    try {
      await experienceService.verify();
    } catch (e) {
      LoggerService.error("Error Auth => experienceService.verify", e);
    }
  };

  const isSocialAuthLoaded = useTypedSelector(
    state => state.account.isSocialAuthLoaded,
  );

  const clickInitFn = (type: string) => {
    countConvs();
    dispatch(setIsSocialAuthLoaded(false));

    const eventType = isSignUp ? "signup_screen_tap" : "login_screen_tap";

    dispatch(
      sendAnalyticsDataThunk({
        type: eventType,
        options: isSignUp ? { event_property_signup_source: type } : {},
      }),
    );

    setTimeout(() => dispatch(setIsSocialAuthLoaded(true)), 7000);
  };

  const handleAuth = async (data: TSocialDataType | TWalletEntry) => {
    try {
      const type: TSocialAuthType = "google";
      const { data: res } = await (isSignUp
        ? entryService.registration(type, data)
        : entryService.login(type, data));

      if (!res) return;

      LocalStorageService.setItem("entryUN", res.entryUsername);
      LocalStorageService.setItem("entryType", type);

      if (!res.accessToken || !res.refreshToken) return;
      HelperService.setupAuthData(res as SuccessfulEntryResponse);

      window.location.reload();
    } catch (error: any) {
      const response = error.response;

      if (
        response?.status === 409 ||
        response.data.message === "user already exist"
      ) {
        const { username } = response.data;
        dispatch(
          setIsRestrictionForCreationPopupOpen({
            open: true,
            type: "google",
            username: username,
          }),
        );
        return;
      }

      LoggerService.error(
        `Error during Google in AcceptPartnerNotConnectedPopup auth`,
        error,
      );
    } finally {
      dispatch(setIsSocialAuthLoaded(true));
      dispatch(forceScrollRerender());
    }
  };

  const { description, button } = (() => {
    if (!invite)
      return {
        description: <></>,
        button: <></>,
      };

    if (isGmail(invite.email as string)) {
      if (isSignUp)
        return {
          description: (
            <Box>
              <p
                className={
                  "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
                }
              >
                <Trans id={"dkjnvdf-3nsdfjkssd-svdvv-jsn"}>
                  In order to accept the invitation, you must register or log in
                  with the email {invite.email}.
                </Trans>
              </p>
            </Box>
          ),
          button: (
            <Box>
              <GoogleLogin
                className={classnames(
                  "button",
                  "button-google",
                  "c-full-width",
                )}
                text={t({
                  message: "Sign up with Google",
                  id: "349t934-dfbldknfb-fbdfbd-Sign-up-with-Google",
                })}
                handleData={handleAuth}
                isSocialLoaded={isSocialAuthLoaded}
                iconSize="24"
                clickInitFn={clickInitFn}
              />
            </Box>
          ),
        };
      return {
        description: (
          <Box>
            <p
              className={
                "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
              }
            >
              <Trans id={"dflkhb-54rntlhf-gnfgnkl"}>
                You can manage this project and its quests.
              </Trans>
            </p>
            <Box
              mt={2}
              component={"p"}
              className={
                "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
              }
            >
              <Trans id={"dkjnvdf-3nsdfjkssd-svdvv-jsn-45lngf"}>
                But first you need login to account with{" "}
                <span className={"c-font-color-3"}>{invite.email}</span>.
              </Trans>
            </Box>
          </Box>
        ),
        button: (
          <Box>
            <GoogleLogin
              className={classnames("button", "button-google", "c-full-width")}
              text={t({
                message: "Login with Google",
                id: "349t-sdf-bj934-dfbldknfb-fbdfbd-Sign-up-with-Google",
              })}
              handleData={handleAuth}
              isSocialLoaded={isSocialAuthLoaded}
              iconSize="24"
              clickInitFn={clickInitFn}
            />
          </Box>
        ),
      };
    }
    if (isSignUp) {
      return {
        description: (
          <p
            className={
              "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
            }
          >
            <Trans id={"fnklvasfd34-leknbf-sdfn-dfbdfjb"}>
              In order to accept the invitation, you must register or log in
              with the email{" "}
              <span className={"c-font-color-3"}>{invite.email}</span>.
            </Trans>
          </p>
        ),
        button: (
          <Button
            href={`/inviteToPartnerProjectSignUp?email=${invite.email}`}
            style={"primary"}
            target={"_self"}
            onClick={() => setIsOpen(false)}
          >
            <Trans id={"dskngber-ekbnfg-fnfgn"}>Sign Up</Trans>
          </Button>
        ),
      };
    }
    return {
      description: (
        <Box>
          <p
            className={
              "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
            }
          >
            <Trans id={"dflkhb-54rntlhf-gnfgnkl"}>
              You can manage this project and its quests.
            </Trans>
          </p>
          <Box
            mt={2}
            component={"p"}
            className={
              "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
            }
          >
            <Trans id={"dkjnvdf-3nsdfjkssd-svdvv-jsn-45lngf"}>
              But first you need login to account with{" "}
              <span className={"c-font-color-3"}>{invite.email}</span>.
            </Trans>
          </Box>
        </Box>
      ),
      button: (
        <Button
          href={`/inviteToPartnerProjectLogin?email=${invite.email}`}
          style={"primary"}
          target={"_self"}
          onClick={() => setIsOpen(false)}
        >
          <Trans id={"dskngber-ekbnfg-fnfgsdfsdfn"}>Login</Trans>
        </Button>
      ),
    };
  })();

  return (
    <>
      <BaseInvitePartnerProjectPopup
        isOpen={!!(isOpen && invite)}
        onClose={onClose}
      >
        {isOpen && invite && (
          <Box
            display={"flex"}
            gap={"20px"}
            flexDirection={"column"}
            alignItems={"center"}
            sx={{
              button: {
                display: "flex",
                alignItems: "center",
              },
              [".button-google"]: {
                ["svg"]: {
                  color: "var(--tasks-google-icon-color)",
                },
              },
            }}
          >
            <Box>
              <InviteToPartnerProjectPopupStyles.AddUser />
            </Box>
            <div
              className={
                "c-fw-500 c-font-color c-font-24-24 has-text-align-center"
              }
            >
              <Trans id={"5595sc-fjdbnk3-23jnbf-1-sdfsd-"}>
                You have been granted access to the project
                <span className={"c-font-color"}>
                  {invite.partnerProject.name}
                </span>
              </Trans>
            </div>
            {description}
            <Box
              display={"flex"}
              alignItems={"center"}
              width={"100%"}
              gap={"20px"}
              justifyContent={"center"}
              sx={{
                button: {
                  flex: 1,
                },
              }}
            >
              {button}
            </Box>
          </Box>
        )}
      </BaseInvitePartnerProjectPopup>
      {!LocalStorageService.accessToken && pathname === "/" && (
        <Box display={"none"}>
          <GoogleLogin
            className={classnames("button", "button-google", "c-full-width")}
            text={t({
              message: "Login with Google",
              id: "349t-sdf-bj934-dfbldknfb-fbdfbd-Sign-up-with-Google",
            })}
            handleData={handleAuth}
            isSocialLoaded={isSocialAuthLoaded}
            iconSize="24"
            clickInitFn={clickInitFn}
          />
        </Box>
      )}
    </>
  );
};

const isGmail = (email: string) => email.endsWith("@gmail.com");
