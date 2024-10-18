import { useState, useCallback } from "react";
import { Box } from "@mui/material";
import { Button } from "@components/UI/button";
import { Icon } from "@components/UI/icon";
import { LoggerService } from "@services";
import { entryService } from "@api";
import { appConfig } from "@/app.config";

type Props = {
  className?: string;
  text?: string;
  handleData: any;
  isSocialLoaded?: boolean;
  iconSize?: string;
  clickInitFn?: any;
  isDisabled?: boolean;
};

const TelegramLogin = ({
  className,
  text,
  handleData,
  isSocialLoaded,
  iconSize,
  clickInitFn,
  isDisabled,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [intervalId, setIntervalId] = useState(null);

  const connectTelegram = useCallback(async () => {
    if (clickInitFn) {
      clickInitFn();
    }

    if (intervalId) {
      clearInterval(intervalId);
    }

    setIsLoaded(false);

    try {
      const { data: telegramData } = await entryService.getSocialsConnect(
        "telegram",
      );

      setTimeout(() => {
        window.open(
          `https://t.me/${appConfig.NEXT_PUBLIC_TG_AUTH_BOT}?start=${telegramData.authCode}`,
        );
      });

      const isTgVerified = await new Promise(resolve => {
        const timeToEndInterval = new Date().getTime() + 120000;

        const interval = setInterval(async () => {
          let isVerified = false;

          try {
            const { data } = await entryService.verifyTelegram();
            isVerified = Boolean(data?.id);
          } catch (error) {
            isVerified = false;
          }

          if (!isVerified && new Date().getTime() < timeToEndInterval) return;

          clearInterval(interval);
          resolve(isVerified);
        }, 1000);

        setIntervalId(interval);
      });

      if (isTgVerified) {
        handleData();
      }
    } catch (error) {
      LoggerService.error("Error during connect telegram", error);
    } finally {
      setIsLoaded(true);
    }
  }, [clickInitFn, handleData, intervalId]);

  return (
    <>
      <Button
        style="task"
        size="task"
        type="button"
        className={className}
        loading={!isLoaded || !isSocialLoaded}
        disabled={isDisabled}
        onClick={connectTelegram}
      >
        <>
          <Icon
            style={{ color: "var(--tasks-telegram-icon-color)" }}
            name="telegram"
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

TelegramLogin.defaultProps = {
  text: "Connect",
  isSocialLoaded: true,
  iconSize: "16",
} as Partial<Props>;

export default TelegramLogin;
