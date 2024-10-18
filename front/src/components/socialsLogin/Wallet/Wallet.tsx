import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { TWalletEntry } from "@/models";
import { Box, CircularProgress } from "@mui/material";
import classNames from "classnames";
import { FC, useEffect, useLayoutEffect, useState } from "react";
import { Link } from "./wallet.styles";
import { useWalletConnect } from "@/hooks";
import { SignWalletPopup } from "@/components/signWalletPopup";

interface Props {
  className?: string;
  text?: string;
  isSocialLoaded?: boolean;
  clickInitFn?: any;
  iconSize?: string;
  handleData: (data: TWalletEntry) => Promise<void>;
  type: "metamask" | "walletconnect";
  iframeAuthPopup?: boolean;
  openOnInit?: boolean;
}

const WalletLogin: FC<Props> = ({
  isSocialLoaded,
  className,
  text,
  iconSize,
  clickInitFn,
  handleData,
  type,
  iframeAuthPopup,
  openOnInit,
}) => {
  const [windowLoaded, setWindowLoaded] = useState<boolean>(false);
  const [isInit, setIsInit] = useState<boolean>(true);

  const {
    handleConnect,
    isLoaded,
    isMetamaskDesktopInstalled,
    isMetamaskMobileInstalled,
    isSignOpen,
    isSignLoading,
    isSignError,
    handleSignClose,
    sign,
  } = useWalletConnect({
    clickInitFn,
    handleData,
    type,
    useBlankWindow: iframeAuthPopup,
  });

  useLayoutEffect(() => setWindowLoaded(true), []);

  useEffect(() => {
    if (!isInit) return;

    if (openOnInit) {
      if (isMetamaskDesktopInstalled || isMetamaskMobileInstalled) {
        handleConnect("metamask");
      } else {
        handleConnect("walletconnect");
      }
      setIsInit(false);
    }
  }, [
    handleConnect,
    isInit,
    isMetamaskDesktopInstalled,
    isMetamaskMobileInstalled,
    openOnInit,
  ]);

  return (
    <>
      <SignWalletPopup
        isOpen={isSignOpen}
        handleClose={handleSignClose}
        isError={isSignError}
        isLoading={isSignLoading}
        onSign={sign}
      />
      {type === "metamask" &&
      !isMetamaskDesktopInstalled &&
      !isMetamaskMobileInstalled ? (
        <Link
          className={classNames(className, {
            disabled: !isLoaded || !isSocialLoaded,
          })}
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
          <>
            {!isLoaded || !isSocialLoaded ? (
              <p className="loadtrt">
                <CircularProgress size={16} color="inherit" />
              </p>
            ) : (
              <>
                <Icon
                  name={
                    type === "metamask"
                      ? "metamask-login"
                      : "walletconnect-login"
                  }
                  size={iconSize}
                />

                <Box component="span" ml={1}>
                  {text}
                </Box>
              </>
            )}
          </>
        </Link>
      ) : (
        <Button
          style="task"
          size="task"
          type="button"
          className={className}
          loading={!isLoaded || !isSocialLoaded}
          disabled={!isLoaded || !isSocialLoaded}
          onClick={handleConnect}
        >
          <>
            <Icon
              name={
                type === "metamask" ? "metamask-login" : "walletconnect-login"
              }
              size={iconSize}
            />

            <Box component="span" ml={1}>
              {text}
            </Box>
          </>
        </Button>
      )}
    </>
  );
};

export default WalletLogin;
