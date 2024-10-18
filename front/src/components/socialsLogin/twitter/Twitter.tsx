import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";

import { Button } from "@components/UI/button";
import { Icon } from "@components/UI/icon";
import { LocalStorageService, LoggerService } from "@services";
import { entryService } from "@api";
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
  type?: "auth" | "task";
  isDisabled?: boolean;
};

let firstTime = true;

const TwitterLogin = ({
  className,
  text,
  handleData,
  isSocialLoaded,
  iconSize,
  clickInitFn,
  isDisabled,
}: Props) => {
  const { asPath, query, replace } = useRouter();

  const loginPrevLocation = useTypedSelector(getLoginPrevLocation);

  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const onAuthDone = useCallback(
    (authData: any) => {
      if (authData.error || authData.oauthVerifier) {
        handleData(authData);
      }

      setIsLoaded(true);
      replace({ query: {} });
    },
    [handleData, replace],
  );

  const getAuthData = useCallback(
    async (oauth_verifier?: string, oauth_token?: string) => {
      const oauthVerifier = oauth_verifier || oauth_token;
      const twitterDataString = await LocalStorageService.getItemAsync(
        "tw_oauth",
      );

      LocalStorageService.removeItem("tw_oauth");

      if (oauthVerifier && twitterDataString) {
        const twitterData = JSON.parse(twitterDataString);

        onAuthDone({
          oauthVerifier: oauthVerifier,
          oauthRequestToken: twitterData.oauthRequestToken,
          oauthRequestTokenSecret: twitterData.oauthRequestTokenSecret,
        });

        return;
      }

      onAuthDone({ error: "Not_authorized" });
    },
    [onAuthDone],
  );

  useEffect(() => {
    if (
      query.flow === "connect_twitter" &&
      (query.oauth_token || query.oauth_verifier) &&
      isLoaded &&
      firstTime
    ) {
      setIsLoaded(false);
      firstTime = false;

      getAuthData(query.oauth_verifier as string, query.oauth_token as string);
    }
  }, [
    getAuthData,
    query.flow,
    query.oauth_token,
    query.oauth_verifier,
    isLoaded,
  ]);

  const connectTwitter = useCallback(async () => {
    if (clickInitFn) {
      clickInitFn("twitter");
    }

    setIsLoaded(false);

    LocalStorageService.setItem("tw_path", asPath.split("?")[0]);
    if (loginPrevLocation) {
      LocalStorageService.setItem("prev_location", loginPrevLocation);
    }

    try {
      const { data: twitterData } = await entryService.getSocialEntry(
        "twitter",
      );

      setTimeout(() => {
        window.open(twitterData.authorizationUrl, "_self");
      });

      LocalStorageService.setItem(
        "tw_oauth",
        JSON.stringify({
          oauthRequestToken: twitterData.oauthRequestToken,
          oauthRequestTokenSecret: twitterData.oauthRequestTokenSecret,
        }),
      );
    } catch (error) {
      LoggerService.error("Error during connect twitter", error);
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
        disabled={!isLoaded || !isSocialLoaded || isDisabled}
        onClick={connectTwitter}
      >
        <>
          <Icon
            style={{ color: "var(--tasks-twitter-icon-color)" }}
            name="twitter"
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

TwitterLogin.defaultProps = {
  text: "Connect",
  isSocialLoaded: true,
  iconSize: "16",
  type: "auth",
} as Partial<Props>;

export default TwitterLogin;
