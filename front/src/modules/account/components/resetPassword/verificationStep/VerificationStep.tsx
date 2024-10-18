import { Tabs } from "@/components/UI/tabs";
import { EResetPasswordFlow } from "@/modules/account/models";
import { Box } from "@mui/material";
import Link from "next/link";
import { Dispatch, FC, SetStateAction, useCallback } from "react";
import { Email } from "./email";
import { Phone } from "./phone";
import { authService } from "@/api";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";

interface Props {
  activeTab: EResetPasswordFlow;
  setActiveTab: (tab: EResetPasswordFlow) => void;
  onVerificationSend: (data: {
    confirmToken: string;
    verificationAddress: string;
  }) => void;
  iframeAuthPopup?: boolean;
  setResetPassword?: Dispatch<SetStateAction<boolean>>;
}

const VerificationStep: FC<Props> = ({
  activeTab,
  setActiveTab,
  onVerificationSend,
  iframeAuthPopup,
  setResetPassword,
}) => {
  const { query } = useRouter();

  const tabs = [
    {
      id: 1,
      title: t({ id: "a1EtNyvMwSSkPoPbS18ag5-account", message: "Email" }),
      tab: EResetPasswordFlow.EMAIL,
    },
    {
      id: 2,
      title: t({
        id: "fane9esHbJS3gR1eoWZ2uv-account",
        message: "Phone Number",
      }),
      tab: EResetPasswordFlow.PHONE,
    },
  ];

  const onSubmit = useCallback(
    async (data: { phone?: string; email?: string }) => {
      if (activeTab === EResetPasswordFlow.EMAIL || data.email) {
        const res = await authService.sendResetPasswordVerification({
          email: data.email,
          type: activeTab,
        });

        if (!res || !res.data.confirmToken || !res.data.email) return;

        onVerificationSend({
          confirmToken: res.data.confirmToken,
          verificationAddress: res.data.email,
        });
      }

      if (activeTab === EResetPasswordFlow.PHONE && data.phone) {
        const res = await authService.sendResetPasswordVerification({
          phone: data.phone,
          type: activeTab,
        });

        if (!res || !res.data.confirmToken || !res.data.phone) return;

        onVerificationSend({
          confirmToken: res.data.confirmToken,
          verificationAddress: res.data.phone,
        });
      }
    },
    [activeTab, onVerificationSend],
  );

  return (
    <Box width="100%" maxWidth="328px">
      <Box
        component="h1"
        mb={2.5}
        textAlign="left"
        className="c-sm-font-32-38 c-fw-500 c-font-color"
      >
        <Trans id="17jDJVUFV4F94U2fe45Fw6-account">Forgot Password</Trans>
      </Box>

      <Box
        mb={2.5}
        textAlign="left"
        className="c-font-20-24 c-fw-500 c-font-color"
      >
        <Trans id="3nump9ZKahTMd5GeztVxJF-account">
          Enter the data that you provided during registration
        </Trans>
      </Box>

      <Tabs
        type="secondary"
        activeTab={activeTab}
        tabs={tabs}
        changeFn={setActiveTab}
      />

      {activeTab === EResetPasswordFlow.EMAIL && (
        <Email onFormSubmit={onSubmit} />
      )}
      {activeTab === EResetPasswordFlow.PHONE && (
        <Phone onFormSubmit={onSubmit} />
      )}

      {iframeAuthPopup ? (
        <a
          className="c-font-14-20 c-fw-400"
          onClick={e => {
            e.preventDefault();
            setResetPassword(false);
          }}
          style={{
            color: "rgba(255, 255, 255, 0.3)",
            textDecorationLine: "underline",
            marginTop: "12px",
            display: "block",
            textAlign: "left",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Trans id="h3ExgTj4DDtySbQqXKngZE-account">Back to Login page</Trans>
        </a>
      ) : (
        <Link
          href={query.change ? "/profile/security" : "/login"}
          className="c-font-14-20 c-fw-400"
          style={{
            color: "rgba(255, 255, 255, 0.3)",
            textDecorationLine: "underline",
            marginTop: "12px",
            display: "block",
            textAlign: "left",
          }}
        >
          {query.change ? (
            <Trans id="vEPm7YWygEozV2uCUwNdSo-verificationStep">
              Back to profile
            </Trans>
          ) : (
            <Trans id="h3ExgTj4DDtySbQqXKngZE-account">
              Back to Login page
            </Trans>
          )}
        </Link>
      )}
    </Box>
  );
};

export default VerificationStep;
