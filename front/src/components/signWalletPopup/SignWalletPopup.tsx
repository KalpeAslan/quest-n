import { Modal } from "../UI/modal";
import { FC, useMemo } from "react";
import { Button } from "../UI/button";
import { Box } from "@mui/material";
import { Wrapper } from "./signWalletPopup.styles";
import { Icon } from "@/components/UI/icon";
import { useAccount } from "wagmi";
import { LogoLoader } from "../logoLoader";
import classNames from "classnames";
import { Trans } from "@lingui/macro";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  onSign: () => void;
  isLoading: boolean;
  isError: boolean;
}

const SignWalletPopup: FC<Props> = ({
  isOpen,
  handleClose,
  onSign,
  isLoading,
  isError,
}) => {
  const { connector } = useAccount();

  const walletLogo = useMemo(() => {
    if (connector?.name && connector.name === "MetaMask") {
      return "metamask-logo";
    }

    return "wallet-connect";
  }, [connector]);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper>
            <Box className="header c-font-24-24 c-fw-500 c-font-color">
              {!isLoading && !isError && (
                <Trans id="aPzB2U5TGRex6skA1civ6r-signWalletPopup">
                  Welcome to AlphaGuilty!
                </Trans>
              )}
              {(isLoading || isError) && (
                <Trans id="dfznLcfBv97VTP27maqxW4-signWalletPopup">
                  Waiting for signature
                </Trans>
              )}

              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={handleClose}
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Box>

            <Box
              className={classNames("content", {
                padding: isLoading || isError,
              })}
            >
              {!isLoading && !isError && (
                <Icon name={walletLogo} size="80" className="walletIcon" />
              )}

              {isLoading && (
                <Box className="icons">
                  <LogoLoader logoSize={40} loaderSize={82} className="mr-14" />
                  <Icon
                    name="right-arrow"
                    width="30"
                    height="12"
                    className="mr-14"
                  />
                  <Icon name={walletLogo} size="80" className="mr-14" />
                </Box>
              )}

              {isError && (
                <Box className="errorIconWrapper">
                  <Icon name="menu-close" size="50" />
                </Box>
              )}

              {!isLoading && !isError && (
                <Box
                  component="h3"
                  className="title c-font-20-22 c-font-color c-fw-500"
                >
                  <Trans id="kwGvCMN8H5Lje3UydieFfc-signWalletPopup">
                    Sign Message
                  </Trans>
                </Box>
              )}

              <Box
                component="p"
                className="text c-font-16-22 c-font-color c-fw-400"
              >
                {!isLoading && !isError && (
                  <Trans id="bAxEiGXD78hDM37zmgafCC-signWalletPopup">
                    Please sigh the message in your wallet
                    <br />
                    to complete the authentication process.
                  </Trans>
                )}

                {isLoading && (
                  <Trans id="ap8PTxuk5NwfRNewNzJV4h-signWalletPopup">
                    Go to your wallet&apos;s app or browser extension to sign
                    the AlphaGuilty connection request.
                  </Trans>
                )}

                {isError && (
                  <Trans id="1LfBDKiuzu6nb6ihbwAMxF-signWalletPopup">
                    An error has occurred. Please try again later.
                  </Trans>
                )}
              </Box>

              {!isLoading && !isError && (
                <Button
                  style="colorfull"
                  className="c-full-width c-font-16-22"
                  onClick={onSign}
                >
                  <Trans id="4Sj4f37PWQuzfJih2FuwVR-signWalletPopup">
                    Sign Message
                  </Trans>
                </Button>
              )}

              {(isLoading || isError) && (
                <Box className="buttons c-full-width">
                  <Button
                    style="error"
                    className="button"
                    onClick={handleClose}
                  >
                    <Trans id="pVeaTKttkrXHPqMDbfZEzc-signWalletPopup">
                      Cancel
                    </Trans>
                  </Button>

                  <Button style="secondary" className="button" onClick={onSign}>
                    <Trans id="db4bxgNyLAGbP6ya9SctC2-signWalletPopup">
                      Resend <span className="desktop">Signature</span>
                    </Trans>
                  </Button>
                </Box>
              )}
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default SignWalletPopup;
