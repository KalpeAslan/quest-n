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
import { adminProjectService, authService, entryService } from "@api";
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
import { useGetUserProfileQuery } from "@modules/account/store/account.api";
import { sendAnalyticsDataThunk } from "@store/slices/analytics/analytics.thunks";
import { forceScrollRerender } from "@store/slices/system/system.slice";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { countConvs } from "@/lib/evaDav";
import {
  disconnectAccountThunk,
  getUserProfileThunk,
} from "@modules/account/store/account.thunks";
import { useWalletConnect } from "@hooks";
import { useRouter } from "next/router";

const DONT_LOG_OUT_PARTNER_PROJECT_KEY = "DONT_LOG_OUT_PARTNER_PROJECT_KEY";

export const AcceptPartnerPAcceptPartnerProjectConnectedPopup = () => {
  const accountInfo = useTypedSelector(getAccountInfo) as IAccount;
  const [invite, setInvite] = useState<IInviteInfoForPartnerProject>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inviteId, setInviteId] = useState<string>("" as string);

  const { pathname } = useRouter();

  const accountMail =
    accountInfo.connectedAccounts.email ||
    accountInfo.connectedAccounts.google ||
    "";

  const { data } = useGetUserProfileQuery(null, {
    skip: !accountInfo.connected,
  });

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    setInviteId(params.get("inviteToPartnerProjectId"));
  }, []);

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const computeIsOpen = () => {
      if (pathname === "/inviteToPartnerProjectLogin" || pathname === "/inviteToPartnerProjectSignUp") return false;
      if (!invite) return false;
      if (!accountInfo.connected) return false;
      if (!data) return false;
      if (
        invite &&
        invite.email.toLowerCase() ===
          (accountInfo.connectedAccounts.email &&
            accountInfo.connectedAccounts.email.toLowerCase())
      )
        return false;

      if (
        invite &&
        invite.email.toLowerCase() ===
          (accountInfo.connectedAccounts.google &&
            accountInfo.connectedAccounts.google.toLowerCase())
      )
        return false;
      return true;
    };

    if (computeIsOpen()) {
      setIsOpen(true);
    }
  }, [accountInfo, invite, accountMail, data, pathname]);

  useEffect(() => {
    if (inviteId) {
      adminProjectService
        .getInviteById(inviteId as string)
        .then(res => setInvite(res.data));
    }
  }, [inviteId]);

  const dispatch = useAppDispatch();

  const isSignUp = invite ? invite.flow === "signUp" : true;

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

  const { disconnect: disconnectWallet } = useWalletConnect();

  const logOut = async () => {
    await disconnectWallet();
    await dispatch(disconnectAccountThunk());
  };

  const handleAuth = async (data: TSocialDataType | TWalletEntry) => {
    try {
      if (+LocalStorageService.getItem(DONT_LOG_OUT_PARTNER_PROJECT_KEY)) {
        await logOut();
      }
      LocalStorageService.removeItem(DONT_LOG_OUT_PARTNER_PROJECT_KEY);
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

  const handleConnectAccount = async (data: TSocialDataType) => {
    if (!accountInfo || data?.error) {
      dispatch(setIsSocialAuthLoaded(true));

      return;
    }

    let fn = data => authService.confirmSocial("google", data);

    try {
      await fn(data);
      LocalStorageService.removeItem(DONT_LOG_OUT_PARTNER_PROJECT_KEY);
      await dispatch(getUserProfileThunk());
      window.location.reload();
    } catch (error: any) {
      const response = error.response;

      if (response?.status === 409) {
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
    } finally {
      dispatch(setIsSocialAuthLoaded(true));
    }
  };

  const { description, button } = (() => {
    if (!invite)
      return {
        description: <></>,
        button: <></>,
      };

    if (isGmail(invite.email)) {
      if (!accountInfo.connectedAccounts.google)
        return {
          description: (
            <Box>
              <p
                className={
                  "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
                }
              >
                <Trans id={"dksdfdsfcsd-sdfjnvdsdf-23rf-3nsdfjkssd-svdvv-jsn"}>
                  The email to which you received the invitation is not
                  associated with this account.
                </Trans>
              </p>
              <Box
                component={"p"}
                mt={1}
                className={
                  "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
                }
              >
                To proceed, link the email{" "}
                <span className={"c-font-color-3"}>{invite.email}</span> to your
                profile.
              </Box>
            </Box>
          ),
          button: (
            <Box>
              <GoogleLogin
                className={classnames("button", "button-google")}
                text={t({
                  id: "vjiZrDhuLxjCVwK2K9uxgh-accounts",
                  message: "Connect Google",
                })}
                handleData={(data: TSocialDataType) => {
                  handleConnectAccount(data);
                }}
                iconSize="24"
                isSocialLoaded={isSocialAuthLoaded}
                clickInitFn={type => {
                  clickInitFn(type);
                  LocalStorageService.setItem(
                    DONT_LOG_OUT_PARTNER_PROJECT_KEY,
                    invite.id,
                  );
                }}
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
              <Trans id={"dkjnvdsdf-23rf-3nsdfjkssd-svdvv-jsn"}>
                {"We've"} located an account associated with the email address
                you received the invitation on.
              </Trans>
            </p>
            <p
              className={
                "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
              }
            >
              To continue, please log out of your current profile and access the
              account registered with{" "}
              <span className={"c-font-color-3"}>{invite.email}</span>.
            </p>
          </Box>
        ),
        button: (
          <Box>
            <GoogleLogin
              className={classnames("button", "button-google", "c-full-width")}
              text={t({
                message: "Sign up with Google",
                id: "349t934-dfbldknfdsf-34nbfb-fbdfbd-Sign-up-with-Google",
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
          <Box>
            <p
              className={
                "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
              }
            >
              The email to which you received the invitation is not associated
              with this account.
            </p>
            <p
              className={
                "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
              }
            >
              <Trans id={"fnklv34-leadknbf-sdfn-dfbdfjbs"}>
                To proceed, log out of the current profile and create  a new one
                using the email{" "}
                <span className={"c-font-color-3"}>{invite.email}</span>.
              </Trans>
            </p>
          </Box>
        ),
        button: (
          <Button
            href={`/inviteToPartnerProjectSignUp?email=${invite.email}`}
            style={"primary"}
            target={"_self"}
            onClick={() => {
              logOut();
              setIsOpen(false);
            }}
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
            <Trans id={"dflksdfsdfhb-54rntlhf-gnfgnkl"}>
              {"We've"} located an account associated with the email address you
              received the invitation on.
            </Trans>
          </p>
          <Box
            mt={2}
            component={"p"}
            className={
              "c-font-color c-fw-400 c-font-16-18 has-text-align-center"
            }
          >
            <Trans id={"dkjnvdf-3nsdfjkssd-svdvv-sdfsdf-4356jsn-45lngf"}>
              To continue, please log out of your current profile and access the
              account registered with{" "}
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
          onClick={() => {
            logOut();
            setIsOpen(false);
          }}
        >
          <Trans id={"dskngber-ekbnfg-sdf-sdgdnf-d"}>Switch account</Trans>
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
      {LocalStorageService.accessToken && pathname === "/" && (
        <>
          {+LocalStorageService.getItem(DONT_LOG_OUT_PARTNER_PROJECT_KEY) ? (
            <GoogleLogin
              className={classnames("button", "button-google")}
              text={t({
                id: "vjiZrDhuLxjCVwK2K9uxgh-accounts",
                message: "Connect Google",
              })}
              handleData={(data: TSocialDataType) => {
                handleConnectAccount(data);
              }}
              iconSize="24"
              isSocialLoaded={isSocialAuthLoaded}
              clickInitFn={type => {
                clickInitFn(type);
                LocalStorageService.setItem(
                  DONT_LOG_OUT_PARTNER_PROJECT_KEY,
                  invite.id,
                );
              }}
            />
          ) : (
            <Box display={"none"}>
              <GoogleLogin
                className={classnames(
                  "button",
                  "button-google",
                  "c-full-width",
                )}
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
      )}
    </>
  );
};

const isGmail = (email: string) => email.endsWith("@gmail.com");
