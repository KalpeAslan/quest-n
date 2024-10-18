import { FC, ReactNode, useState } from "react";
import classnames from "classnames";

import { TwitterLogin } from "@components/socialsLogin/twitter";
import { GoogleLogin } from "@components/socialsLogin/google";

import { TCredsLoginResult, TSocialDataType, TWalletEntry } from "@models";
import { TSocialAuthType } from "@modules/account/models";

import { ButtonsWrapper } from "./authStep.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { EmailLogin } from "@/components/socialsLogin/email";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { Trans } from "@lingui/macro";
import { WalletLogin } from "@/components/socialsLogin/Wallet";
import { CredentialsLogin } from "../credentialsLogin";
import { CBreakpoints } from "@styles/variables";

interface AuthStepProps {
  header: ReactNode;
  twitterButtonText: string;
  discordButtonText: string;
  googleButtonText: string;
  footer: ReactNode;
  handleAuth: (
    data: TSocialDataType | TWalletEntry,
    type: TSocialAuthType,
  ) => Promise<void>;
  emailButtonText?: string;
  onEmailClick: () => void;
  handleCredsLogin: (data: TCredsLoginResult) => void;
  clickInitFn?: (type: string) => void;
  iframeAuthPopup?: boolean;
  authType: TSocialAuthType;
  wallet?: boolean;
}

const AuthStep: FC<AuthStepProps> = ({
  header,
  twitterButtonText,
  googleButtonText,
  footer,
  handleAuth,
  emailButtonText,
  onEmailClick,
  handleCredsLogin,
  clickInitFn,
  iframeAuthPopup,
  authType,
  wallet,
}) => {
  const isSocialAuthLoaded = useTypedSelector(
    state => state.account.isSocialAuthLoaded,
  );
  const [activeTab, setActiveTab] = useState<string>("email");

  const isNotMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(CBreakpoints.md),
  );

  return (
    <>
      {header}

      <ButtonsWrapper mb={{ xs: 2, md: 3 }}>
        {(!iframeAuthPopup || authType === "creds") && (
          <>
            {!emailButtonText && (
              <CredentialsLogin
                handleLogin={handleCredsLogin}
                clickInitFn={clickInitFn}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
          </>
        )}

        {emailButtonText && !iframeAuthPopup && (
          <EmailLogin
            clickInitFn={onEmailClick}
            isSocialLoaded={isSocialAuthLoaded}
            className={classnames("button", "button-email")}
            text={emailButtonText}
          />
        )}

        {!iframeAuthPopup && (
          <Box className="divider" mt="20px" mb="20px">
            <Trans id="fa5z4ww92ZQ9i6j1EENc8W-auth">OR</Trans>
          </Box>
        )}

        {!iframeAuthPopup && (
          <Box
            className="c-font-20-24 c-fw-500 c-font-color"
            textAlign="left"
            mb={1.5}
          >
            {emailButtonText ? (
              <Trans id="1ptndVrUZDxfAMxbdXSD2S-auth">Sign Up With</Trans>
            ) : (
              <Trans id="iBhJShTKbt5NtTuZwZe8RL-auth">Login With</Trans>
            )}
          </Box>
        )}

        {!iframeAuthPopup && (
          <TwitterLogin
            className={classnames("button", "button-twitter", "c-full-width")}
            text={twitterButtonText}
            handleData={(data: TSocialDataType) => {
              handleAuth(data, "twitter");
            }}
            isSocialLoaded={isSocialAuthLoaded}
            iconSize="24"
            clickInitFn={clickInitFn}
          />
        )}

        {!iframeAuthPopup && (
          <GoogleLogin
            className={classnames("button", "button-google", "c-full-width")}
            text={googleButtonText}
            handleData={(data: TSocialDataType) => {
              handleAuth(data, "google");
            }}
            isSocialLoaded={isSocialAuthLoaded}
            iconSize="24"
            clickInitFn={clickInitFn}
          />
        )}

        {isNotMd && (
          <WalletLogin
            className="button c-full-width"
            handleData={async (data: TWalletEntry) => {
              await handleAuth(data, "wallet");
            }}
            type="metamask"
            text="MetaMask"
            iconSize="24"
            isSocialLoaded={isSocialAuthLoaded}
          />
        )}

        <WalletLogin
          className="button c-full-width"
          handleData={async (data: TWalletEntry) => {
            await handleAuth(data, "wallet");
          }}
          type="walletconnect"
          text="WalletConnect"
          iconSize="24"
          isSocialLoaded={isSocialAuthLoaded}
          clickInitFn={clickInitFn}
          iframeAuthPopup={iframeAuthPopup}
          openOnInit={wallet}
        />

        {iframeAuthPopup && (
          <Box className="divider" mt="20px" mb="20px">
            <Trans id="fa5z4ww92ZQ9i6j1EENc8W-auth">OR</Trans>
          </Box>
        )}

        {emailButtonText && iframeAuthPopup && (
          <EmailLogin
            clickInitFn={onEmailClick}
            isSocialLoaded={isSocialAuthLoaded}
            className={classnames("button", "button-email")}
            text={emailButtonText}
            iframeAuthPopup={iframeAuthPopup}
          />
        )}

        {iframeAuthPopup && (
          <Box display="flex" justifyContent="space-between">
            <TwitterLogin
              className={classnames(
                "button",
                "button-twitter",
                "iframeButton",
                "c-full-width",
              )}
              text={twitterButtonText}
              handleData={(data: TSocialDataType) => {
                handleAuth(data, "twitter");
              }}
              isSocialLoaded={isSocialAuthLoaded}
              iconSize="24"
              clickInitFn={clickInitFn}
            />

            <GoogleLogin
              className={classnames(
                "button",
                "button-google",
                "iframeButton",
                "c-full-width",
              )}
              text={googleButtonText}
              handleData={(data: TSocialDataType) => {
                handleAuth(data, "google");
              }}
              isSocialLoaded={isSocialAuthLoaded}
              iconSize="24"
              clickInitFn={clickInitFn}
            />
          </Box>
        )}
      </ButtonsWrapper>

      {footer}
    </>
  );
};

export default AuthStep;
