import { useMemo } from "react";
import { Box } from "@mui/system";
import { isMobile } from "react-device-detect";
import { useContextSelector } from "use-context-selector";
import { useSwitchNetwork, useAccount } from "wagmi";
import { Trans } from "@lingui/macro";
import { Icon } from "@components/UI/icon";
import { AppContext } from "@context";
import { HelperService, LoggerService } from "@services";
import { authService } from "@api";
import {
  WalletButtonStylesContent,
  WalletButtonStylesIcon,
  WalletButtonStylesInfo,
  WalletButtonStylesText,
  WalletButtonStylesButton,
  WalletDisconnect,
} from "./walletButton.styles";
import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  setIsWalletConnectTracked,
  setIsWalletConnected,
  setIsWalletPopupOpen,
} from "@store/slices/system/system.slice";
import { setAccountInfo } from "@modules/account/store/account.slice";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getSystemState } from "@store/slices/system/system.selector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { useWalletConnect } from "@/hooks";

const WalletButton = () => {
  const dispatch = useAppDispatch();
  const { address, connector } = useAccount();

  const { isLoading: switchNetworkLoading } = useSwitchNetwork();
  const accountInfo = useTypedSelector(getAccountInfo);
  const { isWalletPopupOpen, isWalletConnected, isWalletConnectLoading } =
    useTypedSelector(getSystemState);

  const { disconnect: disconnectWallet } = useWalletConnect();

  const connectWallet = useContextSelector(
    AppContext,
    state => state.connectWallet,
  );

  const isLoading = useMemo(() => {
    if (switchNetworkLoading) {
      return true;
    }

    if (isWalletPopupOpen?.status) {
      return true;
    }

    if (isWalletConnectLoading) {
      return true;
    }

    return false;
  }, [switchNetworkLoading, isWalletPopupOpen, isWalletConnectLoading]);

  const handleConnect = async () => {
    if (!connectWallet) {
      return;
    }

    if (address) {
      await disconnectWallet();
    }

    dispatch(
      sendAnalyticsDataThunk({
        type: "wallet_connect_click",
        options: {},
      }),
    );

    if (isMobile) {
      await connectWallet("WalletConnect");

      return;
    }

    dispatch(setIsWalletPopupOpen({ status: true, chainId: null }));
  };

  const handleDisconnect = async () => {
    if (!accountInfo) {
      return;
    }

    try {
      await authService.postDisconnect("wallet");

      dispatch(
        setAccountInfo({
          ...accountInfo,
          wallet: "",
        }),
      );

      await disconnectWallet();

      dispatch(setIsWalletConnected(false));
      dispatch(setIsWalletConnectTracked(false));
    } catch (error: any) {
      LoggerService.error("Error during delete wallet", error);
    }
  };

  const shortAddress = useMemo(() => {
    if (accountInfo?.wallet) {
      return HelperService.getShortAddress(
        accountInfo.wallet,
        4,
      ).toLocaleLowerCase();
    }

    return "";
  }, [accountInfo]);

  const walletLogo = useMemo(() => {
    if (
      accountInfo.wallet === address?.toLocaleLowerCase() &&
      connector?.name &&
      connector.name === "MetaMask"
    ) {
      return "metamask-logo";
    }

    return "wallet-connect";
  }, [accountInfo.wallet, address, connector]);

  return (
    <WalletButtonStylesContent>
      {isWalletConnected && accountInfo?.wallet ? (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap="15px"
        >
          <WalletButtonStylesInfo connect>
            <WalletButtonStylesIcon>
              <Icon name={walletLogo} size="24" />
            </WalletButtonStylesIcon>

            <WalletButtonStylesText
              className={"c-font-16-22 c-fw-500 c-font-color"}
            >
              {shortAddress}
            </WalletButtonStylesText>
          </WalletButtonStylesInfo>

          <WalletDisconnect
            style={"secondary"}
            size="medium"
            connect={false}
            onClick={handleDisconnect}
          >
            <Icon name="menu-close" size="24" />
          </WalletDisconnect>
        </Box>
      ) : (
        <WalletButtonStylesButton
          connect={!accountInfo?.wallet}
          style="task"
          size="medium"
          type="button"
          loading={isLoading}
          disabled={isLoading}
          onClick={handleConnect}
        >
          <>
            <Icon name="wallet" size="24" />

            <Box
              className="c-font-16-22 c-fw-500"
              component="span"
              mt={0.5}
              ml={1.25}
            >
              <Trans id="idJmLEnBHhH5DoabY3dNjf-walletButton">
                Connect Wallet
              </Trans>
            </Box>
          </>
        </WalletButtonStylesButton>
      )}
    </WalletButtonStylesContent>
  );
};

export default WalletButton;
