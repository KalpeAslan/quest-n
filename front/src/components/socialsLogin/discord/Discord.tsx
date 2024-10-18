import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";

import { entryService } from "@api";
import { Button } from "@components/UI/button";
import { Icon } from "@components/UI/icon";
import { LocalStorageService, LoggerService } from "@services";
import { useRouter } from "next/router";

type Props = {
  className?: string;
  text?: string;
  handleData: any;
  isSocialLoaded?: boolean;
  iconSize?: string;
  clickInitFn?: any;
  type?: "auth" | "task";
  isDisabled?: boolean;
};

let firstTime = true;

const DiscordLogin = ({
  className,
  text,
  handleData,
  isSocialLoaded,
  iconSize,
  clickInitFn,
  isDisabled,
}: Props) => {
  const { asPath, query, replace } = useRouter();

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
      query.flow === "connect_discord" &&
      query.code &&
      isLoaded &&
      firstTime
    ) {
      setIsLoaded(false);
      firstTime = false;

      getAuthData(query.code as string);
    }
  }, [getAuthData, query.flow, query.code, isLoaded]);

  const connectDiscord = async () => {
    if (clickInitFn) {
      clickInitFn();
    }

    setIsLoaded(false);

    LocalStorageService.setItem("ds_path", asPath.split("?")[0]);

    try {
      const { data: discordData } = await entryService.getSocialsConnect(
        "discord",
      );

      setTimeout(() => {
        window.open(discordData.authorizationUrl, "_self");
      });
    } catch (error) {
      LoggerService.error("Error during connect discord", error);
    } finally {
      setIsLoaded(true);
    }
  };

  return (
    <>
      <Button
        style="task"
        size="task"
        type="button"
        className={className}
        loading={!isLoaded || !isSocialLoaded}
        disabled={!isLoaded || !isSocialLoaded || isDisabled}
        onClick={connectDiscord}
      >
        <>
          <Icon
            style={{ color: "var(--tasks-discord-icon-color)" }}
            name="discord"
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

DiscordLogin.defaultProps = {
  text: "Connect",
  isSocialLoaded: true,
  iconSize: "16",
} as Partial<Props>;

export default DiscordLogin;
