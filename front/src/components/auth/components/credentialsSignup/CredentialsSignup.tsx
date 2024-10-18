import { TCredsSignupResult } from "@/models";
import { Tabs } from "@components/UI/tabs";
import { t, Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import { FC } from "react";
import { EmailSignup } from "./components/emailSignup";
import { PhoneSignup } from "./components/phoneSignup";
import { Wrapper } from "./credentialSignup.styles";

interface Props {
  handleCredsAuth: (data: TCredsSignupResult) => void;
  clickInitFn?: (type: string) => void;
  activeTab: "email" | "phone" | string;
  setActiveTab: (param: "email" | "phone" | string) => void;
  iframeAuthPopup?: boolean;
}

const CredentialsSignup: FC<Props> = ({
  handleCredsAuth,
  clickInitFn,
  activeTab,
  setActiveTab,
  iframeAuthPopup,
}) => {
  const tabs = [
    {
      id: 1,
      title: t({ id: "iSxX5VrTpY8qJZvhUonGjN-auth", message: "Email" }),
      tab: "email",
    },
    {
      id: 2,
      title: t({ id: "uMRi8AUM8N248JRsTh63E9-auth", message: "Phone Number" }),
      tab: "phone",
    },
  ];

  return (
    <Wrapper>
      <Box
        className="c-sm-font-32-38 c-fw-500 c-font-color"
        component="h3"
        sx={{ textAlign: "left" }}
        mb={{ xs: 2 }}
      >
        <Trans id="mVboud5xZPmKF5hzu7L4Ls-auth">Create Account</Trans>
      </Box>

      <Tabs
        type="secondary"
        activeTab={activeTab}
        tabs={tabs}
        changeFn={tab => setActiveTab(tab as "email" | "phone")}
      />

      {activeTab === "email" && (
        <EmailSignup
          handleCredsAuth={handleCredsAuth}
          clickInitFn={clickInitFn}
          iframeAuthPopup={iframeAuthPopup}
        />
      )}

      {activeTab === "phone" && (
        <PhoneSignup
          handleCredsAuth={handleCredsAuth}
          clickInitFn={clickInitFn}
          iframeAuthPopup={iframeAuthPopup}
        />
      )}
    </Wrapper>
  );
};

export default CredentialsSignup;
