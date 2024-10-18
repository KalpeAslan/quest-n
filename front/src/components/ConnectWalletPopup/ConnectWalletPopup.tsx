import { Modal } from "@/components/UI/modal";
import { FC, useCallback, useMemo } from "react";
import { Wrapper } from "./connectWalletPopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { Trans } from "@lingui/macro";
import image from "@assets/images/quest/rewardsConnectWallet.webp";
import Image from "next/image";
import { useAccount, useConnect, useSwitchNetwork } from "wagmi";
import { fromHex } from "viem";
import { isMobile } from "react-device-detect";
import classNames from "classnames";
import { AppContext } from "@/context";
import { useContextSelector } from "use-context-selector";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  chainToConnect: null | `0x${string}`;
  needConnect: boolean;
  needSwitchChain: boolean;
  actionName: string;
}

const ConnectWalletPopup: FC<Props> = ({
  isOpen,
  handleClose,
  chainToConnect,
  needConnect,
  needSwitchChain,
  actionName,
}) => {
  const { isLoading: isConnectLoading } = useConnect();
  const { isConnected } = useAccount();
  const { switchNetwork, isLoading: isNetworkLoading } = useSwitchNetwork();

  const connectWallet = useContextSelector(
    AppContext,
    state => state.connectWallet,
  );

  const isMetamaskDesktopInstalled = useMemo(() => {
    return Boolean(
      typeof window !== "undefined" && window.ethereum?.isMetaMask,
    );
  }, [isConnected]);

  const onSwitchNetwork = useCallback(() => {
    if (!chainToConnect) return;

    if (needSwitchChain && switchNetwork) {
      switchNetwork(fromHex(chainToConnect, "number"));
      handleClose();
    }
  }, [chainToConnect, handleClose, needSwitchChain, switchNetwork]);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper>
            <Box className="header c-font-24-24 c-fw-500 c-font-color">
              {needSwitchChain ? (
                <Trans id="dFH6Sv24ptb26yD9sgrJJa-connectWalletPopup">
                  Please switch network
                </Trans>
              ) : (
                <Trans id="rH4RcBgejGHvyJ6AnfPSzR-quest">
                  Please connect your wallet
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

            <Box className="content">
              <Image
                src={image}
                alt="Connect wallet"
                width={260}
                height={234}
                className="icon"
              />

              <Box
                component="p"
                className="text c-font-18-24 c-font-color c-fw-500"
                maxWidth="220px"
              >
                {needSwitchChain ? (
                  <Trans id="qTymyWorLu9i1RwwXZYWWw-connectWalletPopup">
                    To {actionName} you need to switch network
                  </Trans>
                ) : (
                  <Trans id="vhK46NU8MUZJ1h2pZHB2f7-connectWalletPopup">
                    To {actionName} you need to connect an e-wallet
                  </Trans>
                )}
              </Box>

              <Box className="buttonsContainer">
                {needConnect && isMetamaskDesktopInstalled && !isMobile && (
                  <Button
                    className="btn"
                    style="secondary"
                    onClick={() => {
                      connectWallet("Metamask");
                      handleClose();
                    }}
                    loading={isConnectLoading || isNetworkLoading}
                  >
                    <>
                      <Icon
                        name="metamask-login"
                        size="24"
                        className="btnIcon"
                      />
                      <Trans id="igH3FioUVGomiahdyrzmBC-connectWalletPopup">
                        MetaMask
                      </Trans>
                    </>
                  </Button>
                )}

                {needConnect && (
                  <Button
                    className={classNames("btn", {
                      full: !isMetamaskDesktopInstalled || isMobile,
                    })}
                    style="secondary"
                    onClick={() => {
                      connectWallet("WalletConnect");
                      handleClose();
                    }}
                    loading={isConnectLoading || isNetworkLoading}
                  >
                    <>
                      <Icon
                        name="walletconnect-login"
                        size="24"
                        className="btnIcon"
                      />
                      <Trans id="4MtghBofKBex7inA4j5H2h-connectWalletPopup">
                        WalletConnect
                      </Trans>
                    </>
                  </Button>
                )}

                {needSwitchChain && !needConnect && (
                  <Button
                    className="btn full"
                    style="secondary"
                    onClick={onSwitchNetwork}
                    loading={isConnectLoading || isNetworkLoading}
                  >
                    <Trans id="mVNbPyt8cipQhhdciFLbs5-connectWalletPopup">
                      Switch network
                    </Trans>
                  </Button>
                )}
              </Box>

              {needSwitchChain && !needConnect && (
                <Box className="c-font-14-14 helper" mt="25px">
                  <Trans id="t53J7ouVEUFVZC5FWkjXXz-connectWalletPopup">
                    If you didn&apos;t receive the request, change network
                    manually
                  </Trans>
                </Box>
              )}
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default ConnectWalletPopup;
