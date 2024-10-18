import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";

import { entryService } from "@api";
import { Button } from "@components/UI/button";
import { Icon } from "@components/UI/icon";
import { LocalStorageService, LoggerService } from "@services";
import { useRouter } from "next/router";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getLoginPrevLocation } from "@/store/slices/system/system.selector";

type Props = {
  className?: string;
  text?: string;
  handleData: any;
  isSocialLoaded?: boolean;
  iconSize?: string;
  clickInitFn?: any;
};

let firstTime = true;

const GoogleLogin = ({
  className,
  text,
  handleData,
  isSocialLoaded,
  iconSize,
  clickInitFn,
}: Props) => {
  const { asPath, query, replace } = useRouter();

  const loginPrevLocation = useTypedSelector(getLoginPrevLocation);

  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const onAuthDone = useCallback(
    (authData: any) => {
      if (authData.error || authData.code) {
        handleData(authData);
      }

      setIsLoaded(true);

      replace({ query: {} });
    },
    [handleData, replace],
  );

  const getAuthData = useCallback(
    (code?: string) => {
      if (code) {
        onAuthDone({ code });

        return;
      }

      onAuthDone({ error: "Not_authorized" });
    },
    [onAuthDone],
  );

  useEffect(() => {
    if (
      query.flow === "connect_google" &&
      query.code &&
      isLoaded &&
      firstTime
    ) {
      setIsLoaded(false);
      firstTime = false;

      getAuthData(query.code as string);
    }
  }, [getAuthData, query.flow, query.code, isLoaded]);

  const connectGoogle = useCallback(async () => {
    if (clickInitFn) {
      clickInitFn("google");
    }

    setIsLoaded(false);

    LocalStorageService.setItem("g_path", asPath.split("?")[0]);
    if (loginPrevLocation) {
      LocalStorageService.setItem("prev_location", loginPrevLocation);
    }

    try {
      const { data: googleData } = await entryService.getSocialEntry("google");

      setTimeout(() => {
        window.open(googleData.authorizationUrl, "_self");
      });
    } catch (error) {
      LoggerService.error("Error during connect google", error);
    } finally {
      setIsLoaded(true);
    }
  }, [asPath, clickInitFn, loginPrevLocation]);

  return (
    <>
      <Button
        style="task"
        size="task"
        type="button"
        className={className}
        loading={!isLoaded || !isSocialLoaded}
        disabled={!isLoaded || !isSocialLoaded}
        onClick={connectGoogle}
      >
        <>
          <Icon
            style={{ color: "var(--tasks-google-icon-color)" }}
            name="google"
            size={iconSize}
          />

          <Box component="span" ml={1}>
            {text}
          </Box>
        </>
      </Button>
    </>
  );
};

GoogleLogin.defaultProps = {
  text: "Connect",
  isSocialLoaded: true,
  iconSize: "16",
} as Partial<Props>;

export default GoogleLogin;
