import { Wrapper } from "./walletLogin.styles";
import { Box } from "@mui/material";
import LogoLoader from "@/components/logoLoader/LogoLoader";
import { useCallback, useState } from "react";
import { useWalletConnect } from "@/hooks";
import { TWalletEntry } from "@/models";
import { SignWalletPopup } from "@/components/signWalletPopup";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { Trans } from "@lingui/macro";

const WalletLogin = () => {
  const [success, setSuccess] = useState<boolean>(false);

  const handleData = useCallback(
    async ({ signature, address }: TWalletEntry) => {
      window.opener.parent.postMessage(
        {
          target: "auth_result",
          location: window.location.href,
          signature,
          address,
        },
        "*",
      );

      setSuccess(true);

      setTimeout(() => {
        window.close();
      }, 1000);
    },
    [],
  );

  const {
    handleConnect,
    isSignOpen,
    isSignLoading,
    isSignError,
    handleSignClose,
    sign,
  } = useWalletConnect({
    handleData,
    type: "walletconnect",
  });

  return (
    <>
      <SignWalletPopup
        isOpen={isSignOpen}
        handleClose={handleSignClose}
        isError={isSignError}
        isLoading={isSignLoading}
        onSign={sign}
      />
      <Wrapper className="background-other">
        <Box className="c-wrap">
          <Box mb={3}>
            {success ? (
              <Icon name="wallet-success" size="126" />
            ) : (
              <LogoLoader className="loader" />
            )}
          </Box>

          <Box component="p" className="c-font-color c-font-32-38 c-fw-500">
            {success ? (
              <Trans id="wcirVCcDA8Y1Paf7oyz4QQ-walletLogin">
                Authorization successful
              </Trans>
            ) : (
              <Trans id="rn1ThBRDFntUMW6vRJnoSF-walletLogin">
                Please confirm the authorization in your e-wallet
              </Trans>
            )}
          </Box>

          {!success && (
            <Box className="buttonsContainer">
              <Button
                style="error"
                className="button c-font-24-24"
                onClick={() => window.close()}
              >
                <Trans id="fUhNVzL37R3NDj1B8dpDyW-walletLogin">Close</Trans>
              </Button>

              <Button
                style="colorfull"
                className="button c-font-24-24"
                onClick={handleConnect}
              >
                <Trans id="juoTjDWeCXaakuCZ3DDbir-walletLogin">
                  Connect <span className="desktop">wallet</span>
                </Trans>
              </Button>
            </Box>
          )}
        </Box>
      </Wrapper>
    </>
  );
};

export default WalletLogin;
