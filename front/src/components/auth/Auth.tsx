import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { accountService, entryService } from "@api";
import {
  TSocialDataType,
  EAuthSteps,
  TCredsSignupResult,
  TCredsLoginResult,
  TWalletEntry,
} from "@models";
import { HelperService, LoggerService, LocalStorageService } from "@services";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import {
  getAccountState,
  getIsRestrictionPopupOpen,
  getIsSocialAuthLoaded,
} from "@modules/account/store/account.selector";
import {
  SuccessfulEntryResponse,
  TCredsAuthType,
  TSocialAuthType,
} from "@/modules/account/models";
import {
  setIsReferralCodeLoading,
  setIsReferralPopupResultOpen,
  setIsRestrictionForCreationPopupOpen,
  setIsSocialAuthLoaded,
  setLocalReferralCode,
  setQuestReferralCode,
} from "@/modules/account/store/account.slice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  AuthCodeStep,
  AuthConfirmStep,
  LimitMessage,
  AuthStep,
} from "./components";
import { forceScrollRerender } from "@/store/slices/system/system.slice";
import { CredentialsSignup } from "./components/credentialsSignup";
import { EmailSent } from "./components/credentialsConfirm/emailSent";
import { PhoneConfirm } from "./components/credentialsConfirm/phoneConfirm";
import { EmailConfirmed } from "./components/credentialsConfirm/emailConfirmed";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { countConvs } from "@/lib/evaDav";
import { useRouter } from "next/router";
import { accountApiEndpoints } from "@modules/account/store/account.api";
import { CredentialsLogin } from "./components/credentialsLogin";
import { ResetPassword } from "./components/resetPassword";
import { UsernameStep } from "./components/usernameStep";
import { experienceService } from "@/api/services";
import { useQuestReferralCode } from "@/hooks/useQuestReferralCode";

interface AuthProps {
  authHeader: ReactNode;
  authFooter: ReactNode;
  twitterButtonText?: string;
  discordButtonText?: string;
  googleButtonText?: string;
  emailButtonText?: string;
  iframeAuthPopup?: boolean;
  authFlow?: "login" | "sign-up";
  wallet?: boolean;
}

const Auth: FC<AuthProps> = ({
  authHeader,
  authFooter,
  twitterButtonText = "Twitter",
  discordButtonText = "Discord",
  googleButtonText = "Google",
  emailButtonText,
  iframeAuthPopup,
  authFlow,
  wallet,
}) => {
  const dispatch = useAppDispatch();

  const [iosRestrictionPopupOpened, setIosRestrictionPopupOpened] =
    useState<boolean>(false);
  const [isReqError, setIsReqError] = useState<boolean>(false);
  const [resetPassword, setResetPassword] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<EAuthSteps>(EAuthSteps.LOGING);
  const [currentDate, setCurrentDate] = useState<number | null>(null);
  const [userPhoneNumber, setUserPhoneNumber] = useState<
    number | string | null
  >(null);
  const [twoFaToken, setTwoFaToken] = useState<string | null>(null);
  const [authType, setAuthType] = useState<TSocialAuthType>("twitter");
  const [credsAuthType, setCredsAuthType] = useState<TCredsAuthType>("email");
  const [credsConfirmToken, setCredsConfirmToken] = useState<string | null>(
    null,
  );
  const [credsSignupInfo, setCredsSignUpInfo] = useState<string | null>(null);

  const { localReferralCode, accountInfo } = useTypedSelector(getAccountState);
  const isSocialAuthLoaded = useTypedSelector(getIsSocialAuthLoaded);
  const isRestrictionPopupOpen = useTypedSelector(getIsRestrictionPopupOpen);
  const [activeTab, setActiveTab] = useState<string>("email");

  const { pathname, push } = useRouter();

  const questReferralCode = useQuestReferralCode();

  const verify = async () => {
    try {
      await experienceService.verify();
    } catch (e) {
      LoggerService.error("Error Auth => experienceService.verify", e);
    }
  };

  const handleAuth = async (
    data: TSocialDataType | TWalletEntry,
    type: TSocialAuthType,
  ) => {
    setAuthType(type);

    if (
      data.error ||
      type === "discord" ||
      type === "creds" ||
      type === "telegram"
    ) {
      dispatch(setIsSocialAuthLoaded(true));

      return;
    }

    try {
      const { data: res } = await (pathname === "/login"
        ? entryService.login(type, data)
        : entryService.registration(type, data));

      if (!res) return;

      LocalStorageService.setItem("entryUN", res.entryUsername);
      LocalStorageService.setItem("entryType", type);

      if (res.flow === "login" && res.twoFactorAuth && res.twoFactorAuthToken) {
        setTwoFaToken(res.twoFactorAuthToken);
        setUserPhoneNumber(res.phoneNumber);
        setCurrentStep(EAuthSteps.CODE);
        if (iframeAuthPopup) {
          setAuthType(null);
        }
        return;
      }

      if (!res.accessToken || !res.refreshToken) return;
      HelperService.setupAuthData(res as SuccessfulEntryResponse);

      if (res.flow === "login" && !res.twoFactorAuth) {
        dispatch(accountApiEndpoints.getUserProfile.initiate(null));
        await verify();

        await dispatch(accountApiEndpoints.getUserAnalyticsInfo.initiate(null));

        dispatch(
          sendAnalyticsDataThunk({ type: "login_complete", options: {} }),
        );

        return;
      }

      if (res.flow === "create" && (localReferralCode || questReferralCode)) {
        dispatch(setIsReferralCodeLoading(true));
        setCurrentStep(EAuthSteps.USERNAME);

        return;
      }

      if (res.flow === "create" && !localReferralCode) {
        setCurrentStep(EAuthSteps.USERNAME);
      }

      if (res.flow === "create" && !questReferralCode) {
        setCurrentStep(EAuthSteps.USERNAME);
      }
    } catch (error: any) {
      const response = error.response;

      if (
        response?.status === 409 ||
        response.data.message === "user already exist"
      ) {
        const { username } = response.data;

        if (type === "twitter") {
          dispatch(
            setIsRestrictionForCreationPopupOpen({
              open: true,
              type: "twitter",
              username: username,
            }),
          );
        }

        if (type === "google") {
          dispatch(
            setIsRestrictionForCreationPopupOpen({
              open: true,
              type: "google",
              username: username,
            }),
          );
        }

        if (type === "wallet") {
          dispatch(
            setIsRestrictionForCreationPopupOpen({
              open: true,
              type: "wallet",
              username: username,
            }),
          );
        }

        return;
      }

      LoggerService.error(`Error during ${type} auth`, error);
    } finally {
      dispatch(setIsSocialAuthLoaded(true));
      dispatch(forceScrollRerender());
    }
  };

  const handleCredsSignup = (data: TCredsSignupResult) => {
    if (!data.email && !data.phone) return;
    if (data.email) {
      setCredsAuthType("email");
      LocalStorageService.setItem("entryType", "email");
    }
    if (data.phone) {
      setCredsAuthType("phone");
      LocalStorageService.setItem("entryType", "phone");
    }
    setCredsSignUpInfo(data.email || data.phone);
    setCredsConfirmToken(data.confirmToken);
    setCurrentStep(EAuthSteps.CODE);
  };

  const handleCredsLogin = async (data: TCredsLoginResult) => {
    if (!data.twoFactorAuth && data.accessToken && data.refreshToken) {
      HelperService.setupAuthData({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      await dispatch(accountApiEndpoints.getUserProfile.initiate(null));
      await verify();

      await dispatch(accountApiEndpoints.getUserAnalyticsInfo.initiate(null));

      dispatch(sendAnalyticsDataThunk({ type: "login_complete", options: {} }));
    }
    if (data.twoFactorAuth && data.phoneNumber && data.twoFactorAuthToken) {
      setTwoFaToken(data.twoFactorAuthToken);
      setUserPhoneNumber(data.phoneNumber);
      setCurrentStep(EAuthSteps.CODE);
      if (iframeAuthPopup) {
        setAuthType(null);
      }
    }
  };

  const openIosRestrictionPopup = useCallback(() => {
    if (
      navigator.userAgent.toLowerCase().includes("safari") &&
      navigator.userAgent.toLowerCase().includes("iphone") &&
      !isSocialAuthLoaded &&
      iosRestrictionPopupOpened &&
      !accountInfo.connected
    ) {
      dispatch(setIsSocialAuthLoaded(true));
      dispatch(
        setIsRestrictionForCreationPopupOpen({
          open: true,
          type: "safari",
          username: "",
        }),
      );
      setIosRestrictionPopupOpened(false);
    }
  }, [
    dispatch,
    iosRestrictionPopupOpened,
    isSocialAuthLoaded,
    accountInfo.connected,
  ]);

  useEffect(() => {
    openIosRestrictionPopup();
  }, [openIosRestrictionPopup]);

  useEffect(() => {
    if (
      isRestrictionPopupOpen?.open &&
      isRestrictionPopupOpen?.type === "safari" &&
      (accountInfo.connected || currentStep === EAuthSteps.USERNAME)
    ) {
      dispatch(setIsRestrictionForCreationPopupOpen(null));
    }
  }, [isRestrictionPopupOpen, accountInfo.connected, dispatch, currentStep]);

  const clickInitFn = (type: string) => {
    countConvs();
    dispatch(setIsSocialAuthLoaded(false));

    const eventType = emailButtonText
      ? "signup_screen_tap"
      : "login_screen_tap";

    dispatch(
      sendAnalyticsDataThunk({
        type: eventType,
        options: emailButtonText ? { event_property_signup_source: type } : {},
      }),
    );

    if (type !== "wallet") {
      setTimeout(() => setIosRestrictionPopupOpened(true), 6000);
    }
    setTimeout(() => dispatch(setIsSocialAuthLoaded(true)), 7000);
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

  const handleUsernameFilled = useCallback(async () => {
    await completeAuth();
    await addReferralCode();
  }, [addReferralCode, completeAuth]);

  useEffect(() => {
    if (activeTab === "phone") {
      setCredsAuthType("phone");
    } else {
      setCredsAuthType("email");
    }
  }, [activeTab]);

  return (
    <>
      {(currentStep === EAuthSteps.LOGING ||
        currentStep === EAuthSteps.SIGNUP) &&
        authType !== "creds" &&
        !resetPassword && (
          <AuthStep
            header={authHeader}
            twitterButtonText={twitterButtonText}
            discordButtonText={discordButtonText}
            googleButtonText={googleButtonText}
            emailButtonText={emailButtonText}
            footer={authFooter}
            handleAuth={handleAuth}
            onEmailClick={() => setAuthType("creds")}
            handleCredsLogin={handleCredsLogin}
            clickInitFn={clickInitFn}
            iframeAuthPopup={iframeAuthPopup}
            authType={authType}
            wallet={wallet}
          />
        )}

      {currentStep === EAuthSteps.USERNAME && !resetPassword && (
        <UsernameStep
          skip={handleUsernameFilled}
          submitCallback={handleUsernameFilled}
        />
      )}

      {!isReqError &&
        currentStep === EAuthSteps.CODE &&
        authType !== "creds" &&
        !resetPassword && (
          <AuthCodeStep
            twoFaToken={twoFaToken}
            userPhoneNumber={userPhoneNumber}
            setIsReqError={setIsReqError}
            setCurrentStep={setCurrentStep}
            setCurrentDate={setCurrentDate}
            credsAuthType={credsAuthType}
          />
        )}

      {!isReqError &&
        currentStep === EAuthSteps.CONFIRM &&
        authType !== "creds" &&
        !resetPassword && (
          <AuthConfirmStep
            twoFaToken={twoFaToken}
            currentDate={currentDate}
            userPhoneNumber={userPhoneNumber}
            setIsReqError={setIsReqError}
            setCurrentDate={setCurrentDate}
            setCurrentStep={setCurrentStep}
          />
        )}

      {!isReqError &&
        (currentStep === EAuthSteps.LOGING ||
          currentStep === EAuthSteps.SIGNUP) &&
        authType === "creds" &&
        !(iframeAuthPopup && authFlow === "login") &&
        !resetPassword && (
          <CredentialsSignup
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleCredsAuth={handleCredsSignup}
            clickInitFn={clickInitFn}
            iframeAuthPopup={iframeAuthPopup}
          />
        )}

      {iframeAuthPopup &&
        authType === "creds" &&
        authFlow === "login" &&
        (currentStep === EAuthSteps.LOGING ||
          currentStep === EAuthSteps.SIGNUP) &&
        !resetPassword && (
          <CredentialsLogin
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogin={handleCredsLogin}
            clickInitFn={clickInitFn}
            iframeAuthPopup={iframeAuthPopup}
            setResetPassword={setResetPassword}
          />
        )}

      {iframeAuthPopup && resetPassword && (
        <ResetPassword
          iframeAuthPopup={iframeAuthPopup}
          setResetPassword={setResetPassword}
        />
      )}

      {!isReqError &&
        currentStep === EAuthSteps.CODE &&
        authType === "creds" &&
        credsAuthType === "email" &&
        !resetPassword && <EmailSent email={credsSignupInfo} />}

      {!isReqError &&
        currentStep === EAuthSteps.CODE &&
        authType === "creds" &&
        credsAuthType === "phone" &&
        !resetPassword && (
          <PhoneConfirm
            confirmToken={credsConfirmToken}
            phone={credsSignupInfo}
            setAuthStep={setCurrentStep}
            setConfirmToken={setCredsConfirmToken}
            iframeAuthPopup={iframeAuthPopup}
          />
        )}

      {!isReqError &&
        currentStep === EAuthSteps.CONFIRM &&
        authType === "creds" &&
        credsAuthType === "email" &&
        !resetPassword && <EmailConfirmed />}

      {isReqError && <LimitMessage />}
    </>
  );
};

export default Auth;
