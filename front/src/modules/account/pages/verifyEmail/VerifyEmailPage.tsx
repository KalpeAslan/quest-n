import { accountService, entryService, experienceService } from "@/api";
import { EmailSent } from "@/components/auth/components/credentialsConfirm/emailSent";
import { useDebouncedEffect } from "@/hooks";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { HelperService, LoggerService } from "@/services";
import { getQueryVariable } from "@/utils";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { accountApiEndpoints } from "../../store/account.api";
import {
  setIsReferralCodeLoading,
  setIsReferralPopupResultOpen,
  setLocalReferralCode,
  setQuestReferralCode,
} from "../../store/account.slice";
import { UsernameStep } from "@/components/auth/components/usernameStep";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { useQuestReferralCode } from "@/hooks/useQuestReferralCode";

const VerifyEmailPage = ({
  token: serverToken,
  referralCode: serverReferralCode,
  email: serverEmail,
  redirect: serverRedirect,
  questReferralCode: serverQuestReferralCode,
}) => {
  const { query, push, pathname } = useRouter();

  const dispatch = useAppDispatch();

  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [emailToken, setEmailToken] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [redirect, setRedirect] = useState<string | null>(null);

  const questReferralCode = useQuestReferralCode();

  const verify = async () => {
    try {
      await experienceService.verify();
    } catch (e) {
      LoggerService.error(
        "Error VerifyEmailPage => experienceService.verify",
        e,
      );
    }
  };

  const confirmEmail = useCallback(
    async (token: string) => {
      try {
        const { data: result } = await entryService.confirm2fa("email", {
          emailToken: token,
        });

        if (!result || !result.accessToken || !result.refreshToken)
          throw new Error();

        HelperService.setupAuthData({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        await dispatch(accountApiEndpoints.getUserProfile.initiate(null));

        setConfirmed(true);
      } catch (error) {
        if (
          ["wrong referrer code", "expired referrer period"].includes(
            error.response.data.message,
          )
        ) {
          dispatch(setIsReferralPopupResultOpen({ open: true, type: "error" }));
          return;
        }

        push("/");
      }
    },
    [dispatch, push],
  );

  const addReferralCode = useCallback(async () => {
    if (!questReferralCode && !referralCode) {
      return;
    }

    try {
      if (questReferralCode && !pathname.includes("login")) {
        await accountService
          .postAddQuestReferral({
            code: questReferralCode || referralCode,
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
  }, [dispatch, referralCode, pathname, push, questReferralCode]);

  const completeAuth = useCallback(async () => {
    await dispatch(accountApiEndpoints.getUserProfile.initiate(null));

    await verify();

    dispatch(
      sendAnalyticsDataThunk({
        type: "signup_complete",
        options: {
          event_property_signup_source: "creds/email",
          event_property_signup_with_referral: false,
        },
      }),
    );

    await verify();

    dispatch(await accountApiEndpoints.getUserAnalyticsInfo.initiate(null));

    push(redirect || "/");
  }, [dispatch, push, redirect]);

  const handleUsernameFilled = useCallback(async () => {
    await completeAuth();
    await addReferralCode();
  }, [addReferralCode, completeAuth]);

  useEffect(() => {
    const tokenFromWindow = getQueryVariable("token");
    const emailFromWindow = getQueryVariable("email");
    const referralCodeFromWindow = getQueryVariable("referral_code");
    const questReferralCodeFromWindow = getQueryVariable("quest_referral_code");
    const redirectFromWindow = getQueryVariable("redirect");

    const newToken = (query.token as string) || serverToken || tokenFromWindow;
    const newEmail = (query.email as string) || serverEmail || emailFromWindow;
    const newReferralCode =
      (query.referral_code as string) ||
      serverReferralCode ||
      referralCodeFromWindow;
    const newQuestReferralCode =
      (query.quest_referral_code as string) ||
      serverQuestReferralCode ||
      questReferralCodeFromWindow;
    const newRedirect =
      (query.redirect as string) || serverRedirect || redirectFromWindow;

    newReferralCode && setReferralCode(newReferralCode as string);
    if (newQuestReferralCode) {
      setReferralCode(newQuestReferralCode);
      dispatch(setQuestReferralCode(newQuestReferralCode as string));
    }
    newEmail && setEmail(newEmail as string);
    newToken && setEmailToken(newToken as string);
    newRedirect && setRedirect(newRedirect as string);
  }, [
    query.email,
    query.redirect,
    query.referral_code,
    query.token,
    serverEmail,
    serverRedirect,
    serverReferralCode,
    serverToken,
    query.quest_referral_code,
    serverQuestReferralCode,
    dispatch,
  ]);

  useDebouncedEffect(
    () => {
      if (confirmed) return;

      if (emailToken) {
        confirmEmail(emailToken);
      }
    },
    { timeout: 1000, ignoreInitialCall: true },
    [emailToken, confirmed, confirmEmail],
  );

  useDebouncedEffect(
    () => {
      if (!emailToken || !email) {
        push("/");
      }
    },
    { timeout: 1000, ignoreInitialCall: true },
    [emailToken, email, push],
  );

  return (
    <div className="background-other">
      <Box
        mt={5}
        mb={5}
        sx={{
          flex: 1,
          width: "100%",
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {!confirmed && <EmailSent email={email} />}

        {confirmed && (
          <UsernameStep
            authType="email"
            skip={handleUsernameFilled}
            submitCallback={handleUsernameFilled}
          />
        )}
      </Box>
    </div>
  );
};

export default VerifyEmailPage;
