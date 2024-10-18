import { TWalletEntry } from "@/models";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { MESSAGE_TO_SIGN } from "@/models/Wallet";
import { useWeb3Modal } from "@web3modal/react";

interface Props {
  clickInitFn?: any;
  handleData?: (data: TWalletEntry) => Promise<void>;
  type?: "metamask" | "walletconnect";
  useBlankWindow?: boolean;
  signatureError?: () => void;
  connectError?: () => void;
}

const useWalletConnect = (props?: Props) => {
  const {
    clickInitFn,
    handleData,
    type,
    useBlankWindow,
    signatureError,
    connectError,
  } = props || {};

  const popup = useRef<Window | null>(null);
  const popupLocation = useRef<string | null>(null);

  const { open } = useWeb3Modal();

  const { address, isConnected, connector } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const [isSignOpen, setIsSignOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [isInstallClicked, setIsInstallClicked] = useState<boolean>(false);
  const [needSign, setNeedSign] = useState<boolean>(false);
  const [isSignErrorLocal, setIsSignErrorLocal] = useState<boolean>(false);

  const {
    signMessageAsync,
    isLoading,
    isError: isSignError,
  } = useSignMessage();

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

  const onMessage = useCallback(
    async (e: MessageEvent) => {
      if (
        e.data.target !== "auth_result" ||
        !e.data.address ||
        !e.data.signature
      )
        return;
      handleData &&
        (await handleData({
          address: e.data.address,
          signature: e.data.signature,
        }));
      window.removeEventListener("message", onMessage);
    },
    [handleData],
  );

  const disconnect = useCallback(async () => {
    await disconnectAsync();
  }, [disconnectAsync]);

  const handleConnect = useCallback(
    async (funcType?: "metamask" | "walletconnect") => {
      if (useBlankWindow) {
        popupLocation.current = null;
        popup.current = window.open("", "wallet_oauth", "height=700,width=500");
        if (popup.current) {
          popup.current.location = `${window.location.origin}/wallet-login`;

          window.addEventListener("message", onMessage);
          popup.current.focus();
        }
        return;
      }

      if (clickInitFn) {
        clickInitFn("wallet");
      }

      const localType = ["metamask", "walletconnect"].includes(funcType)
        ? funcType
        : type;

      if (
        localType === "metamask" &&
        !isMetamaskDesktopInstalled &&
        !isMetamaskMobileInstalled
      ) {
        if (!isInstallClicked) {
          window.open("https://metamask.io/download/", "_blank")?.focus();
          setIsInstallClicked(true);
        } else {
          location.reload();
        }

        return;
      }

      setIsLoaded(false);

      try {
        if (address) {
          await disconnect();
          await connector.disconnect();
        }

        if (localType === "metamask") {
          await connectAsync({
            connector: connectors[1],
          });
          setNeedSign(true);
          return;
        }

        open();
        setNeedSign(true);
      } catch (error) {
        console.log("Error", error);

        if (connectError) {
          connectError();
        }
      } finally {
        setIsLoaded(true);
      }
    },
    [
      address,
      clickInitFn,
      connectAsync,
      connectError,
      connectors,
      disconnect,
      connector,
      isInstallClicked,
      isMetamaskDesktopInstalled,
      isMetamaskMobileInstalled,
      onMessage,
      open,
      type,
      useBlankWindow,
    ],
  );

  useEffect(() => {
    if (isConnected && needSign) {
      setIsSignOpen(true);
    }
  }, [isConnected, needSign]);

  const sign = useCallback(async () => {
    try {
      const signature = await signMessageAsync({ message: MESSAGE_TO_SIGN });

      handleData && (await handleData({ signature, address }));
      setIsSignOpen(false);
    } catch (error) {
      setIsSignErrorLocal(true);
      if (signatureError) {
        signatureError();
      } else {
        console.log("Error", error);
      }
    }
  }, [address, handleData, signMessageAsync, signatureError]);

  const handleSignClose = useCallback(async () => {
    await disconnect();
    setIsSignOpen(false);
    setIsSignErrorLocal(false);
    setNeedSign(false);
  }, [disconnect]);

  return {
    handleConnect,
    address,
    isLoaded,
    isMetamaskDesktopInstalled,
    isMetamaskMobileInstalled,
    isConnected,
    sign,
    disconnect,
    isSignLoading: isLoading,
    isSignError: isSignError && isSignErrorLocal,
    isSignOpen,
    handleSignClose,
  };
};

export default useWalletConnect;
