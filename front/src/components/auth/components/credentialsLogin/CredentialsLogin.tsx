import { Tabs } from "@/components/UI/tabs";
import { EmailLoginForm } from "./emailLoginForm";
import { PhoneLoginForm } from "./phoneLoginForm";
import { Dispatch, FC, SetStateAction } from "react";
import { TCredsLoginResult } from "@/models";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { t } from "@lingui/macro";

interface Props {
  handleLogin: (data: TCredsLoginResult) => void;
  clickInitFn?: (type: string) => void;
  activeTab: "email" | "phone" | string;
  setActiveTab: (param: "email" | "phone" | string) => void;
  iframeAuthPopup?: boolean;
  setResetPassword?: Dispatch<SetStateAction<boolean>>;
}

const CredentialsLogin: FC<Props> = ({
  handleLogin,
  clickInitFn,
  activeTab,
  setActiveTab,
  iframeAuthPopup,
  setResetPassword,
}) => {
  const isSocialAuthLoaded = useTypedSelector(
    state => state.account.isSocialAuthLoaded,
  );

  const tabs = [
    {
      id: 1,
      title: t({ id: "xeqp5y9HYN1phd2C6Lbw2n-auth", message: "Email" }),
      tab: "email",
    },
    {
      id: 2,
      title: t({ id: "skmXo39oTZGytwoMuZRXxS-auth", message: "Phone Number" }),
      tab: "phone",
    },
  ];

  return (
    <>
      <Tabs
        type="secondary"
        activeTab={activeTab}
        tabs={tabs}
        changeFn={setActiveTab}
      />

      {activeTab === "email" && (
        <EmailLoginForm
          handleLogin={handleLogin}
          isSocialAuthLoaded={isSocialAuthLoaded}
          clickInitFn={clickInitFn}
          iframeAuthPopup={iframeAuthPopup}
          setResetPassword={setResetPassword}
        />
      )}
      {activeTab === "phone" && (
        <PhoneLoginForm
          handleLogin={handleLogin}
          isSocialAuthLoaded={isSocialAuthLoaded}
          clickInitFn={clickInitFn}
          iframeAuthPopup={iframeAuthPopup}
          setResetPassword={setResetPassword}
        />
      )}
    </>
  );
};

export default CredentialsLogin;
