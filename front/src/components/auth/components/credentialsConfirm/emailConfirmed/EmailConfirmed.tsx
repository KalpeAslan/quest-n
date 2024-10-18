import { accountService } from "@/api";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { accountApiEndpoints } from "@modules/account/store/account.api";
import { setIsReferralPopupResultOpen } from "@/modules/account/store/account.slice";
import { experienceService } from "@/api/services";
import { LoggerService } from "@services";
import { useQuestReferralCode } from "@/hooks/useQuestReferralCode";

interface Props {
  referralCode?: string;
  redirect?: string;
}

const EmailConfirmed: FC<Props> = ({ referralCode, redirect }) => {
  const { push } = useRouter();

  const dispatch = useAppDispatch();

  const [seconds, setSeconds] = useState(3);

  const questReferralCode = useQuestReferralCode();

  const setupAuthData = useCallback(async () => {
    await dispatch(accountApiEndpoints.getUserProfile.initiate(null));

    dispatch(
      sendAnalyticsDataThunk({
        type: "signup_complete",
        options: {
          event_property_signup_source: "creds/email",
          event_property_signup_with_referral: Boolean(referralCode),
        },
      }),
    );
    try {
      await experienceService.verify();
    } catch (e) {
      LoggerService.error(
        "Error EmailConfirmed => experienceService.verify",
        e,
      );
    }

    await dispatch(accountApiEndpoints.getUserAnalyticsInfo.initiate(null));

    if (referralCode) {
      if (questReferralCode) {
        await accountService
          .postAddQuestReferral({ code: questReferralCode })
          .then(res => {
            push(`/quest/${res.data.response.questLinkTitle}`);
          });
      } else {
        await accountService.postAddReferral({ code: referralCode });
      }

      dispatch(
        setIsReferralPopupResultOpen({
          open: true,
          type: "success",
        }),
      );
    }
  }, [dispatch, referralCode, questReferralCode]);

  const goToAccount = useCallback(async () => {
    await setupAuthData();
    push(redirect || "/");
  }, [push, redirect, setupAuthData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      goToAccount();
    }
  }, [seconds, goToAccount]);

  return (
    <Box maxWidth="328px" width="100%">
      <Box
        component="h3"
        className="c-sm-font-32-38 c-fw-500 c-font-color"
        mb="20px"
      >
        <Trans id="gten1mTq22JWdyqsY6syDV-auth">
          Email verified, thanks for joining us
        </Trans>
      </Box>

      <Box
        sx={{
          borderRadius: "50%",
          background: "rgba(135, 246, 150, 0.1)",
          width: "80px",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          marginBottom: "20px",
        }}
      >
        <Icon width={40} height={40} name="email-confirmed" />
      </Box>

      <Button style="secondary" className="c-full-width" onClick={goToAccount}>
        <Trans id="8Qej8a9wutaKrn1MnxU4iG-auth">
          To personal account ({seconds})
        </Trans>
      </Button>
    </Box>
  );
};

export default EmailConfirmed;
