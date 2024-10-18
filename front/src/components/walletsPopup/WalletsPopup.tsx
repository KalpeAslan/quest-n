import { useLayoutEffect, useMemo, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { t, Trans } from "@lingui/macro";
import { useAccount } from "wagmi";

import { Icon } from "@components/UI/icon";
import { Modal } from "@components/UI/modal";
import { AppContext } from "@context";
import {
  WalletsPopupStylesButton,
  WalletsPopupStylesLink,
  WalletsPopupStylesSubtitle,
  WalletsPopupStylesTitle,
  WalletsPopupStylesWrapper,
} from "./walletsPopup.styles";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { setIsWalletPopupOpen } from "@/store/slices/system/system.slice";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getSystemState } from "@store/slices/system/system.selector";

const WalletsPopup = () => {
  const dispatch = useAppDispatch();
  const [windowLoaded, setWindowLoaded] = useState<boolean>(false);

  const { address } = useAccount();

  const connectWallet = useContextSelector(
    AppContext,
    state => state.connectWallet,
  );
  const { isWalletPopupOpen } = useTypedSelector(getSystemState);

  const isMetamaskDesktopInstalled = useMemo(() => {
    return Boolean(
      typeof window !== "undefined" && window.ethereum?.isMetaMask,
    );
  }, [address]);

  const isMetamaskMobileInstalled = useMemo(() => {
    return Boolean(
      typeof window !== "undefined" &&
        !isMetamaskDesktopInstalled &&
        window.ethereum,
    );
  }, [isMetamaskDesktopInstalled]);

  useLayoutEffect(() => setWindowLoaded(true), []);

  return (
    <>
      {isWalletPopupOpen && isWalletPopupOpen.status && (
        <Modal
          isOpen={true}
          handleClose={() =>
            dispatch(setIsWalletPopupOpen({ status: false, chainId: null }))
          }
        >
          <WalletsPopupStylesWrapper>
            {!isMetamaskDesktopInstalled && !isMetamaskMobileInstalled ? (
              <WalletsPopupStylesLink
                href={
                  windowLoaded
                    ? `https://metamask.app.link/${
                        window.location.host.includes("3000")
                          ? "stage.alphaguilty.io"
                          : window.location.host
                      }`
                    : "https://metamask.io/download/"
                }
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="metamask-logo" size="55" />

                <WalletsPopupStylesTitle className={"c-fw-700 c-font-24-31"}>
                  <Trans id="d8xpqZAzYX5o6bhZK4HDAd-walletsPopup">
                    MetaMask
                  </Trans>
                </WalletsPopupStylesTitle>
                <WalletsPopupStylesSubtitle className={"c-fw-500 c-font-16-22"}>
                  {t({
                    id: "gN2txgmZhoXaYSdQb9p9d8-walletsPopup",
                    message: "Connect to your MetaMask wallet",
                  })}
                </WalletsPopupStylesSubtitle>
              </WalletsPopupStylesLink>
            ) : (
              <WalletsPopupStylesButton
                onClick={async () => {
                  if (!connectWallet) {
                    return;
                  }

                  await connectWallet("Metamask");

                  dispatch(
                    setIsWalletPopupOpen({ status: false, chainId: null }),
                  );
                }}
              >
                <Icon name="metamask-logo" size="55" />

                <WalletsPopupStylesTitle className={"c-fw-700 c-font-24-31"}>
                  <Trans id="d8xpqZAzYX5o6bhZK4HDAd-walletsPopup">
                    MetaMask
                  </Trans>
                </WalletsPopupStylesTitle>
                <WalletsPopupStylesSubtitle className={"c-fw-500 c-font-16-22"}>
                  {!isMetamaskDesktopInstalled || isMetamaskMobileInstalled
                    ? t({
                        id: "gN2txgmZhoXaYSdQb9p9d8-walletsPopup",
                        message: "Connect to your MetaMask wallet",
                      })
                    : t({
                        id: "n2phNaCZNxofrssmryT4y9-walletsPopup",
                        message: "Install Metamask",
                      })}
                </WalletsPopupStylesSubtitle>
              </WalletsPopupStylesButton>
            )}

            <WalletsPopupStylesButton
              onClick={async () => {
                if (!connectWallet) {
                  return;
                }

                connectWallet("WalletConnect");

                dispatch(
                  setIsWalletPopupOpen({ status: false, chainId: null }),
                );
              }}
            >
              <Icon name="wallet-connect" size="45" />

              <WalletsPopupStylesTitle
                component="p"
                className={"c-fw-700 c-font-24-31"}
                mt={0.4}
              >
                <Trans id="bEKNHChfaQFZsnseyc8bE2-walletsPopup">
                  WalletConnect
                </Trans>
              </WalletsPopupStylesTitle>
              <WalletsPopupStylesSubtitle className={"c-fw-500 c-font-16-22"}>
                <Trans id="2uWKVRjXNrhAMaKRqXURZo-walletsPopup">
                  Scan with WalletConnect to connect
                </Trans>
              </WalletsPopupStylesSubtitle>
            </WalletsPopupStylesButton>
          </WalletsPopupStylesWrapper>
        </Modal>
      )}
    </>
  );
};

export default WalletsPopup;
