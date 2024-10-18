import { LocalStorageService } from "@/services";
import { getQueryVariable } from "@/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

const localStorageKeys = {
  google: "g_path",
  twitter: "tw_path",
  telegram: "tg_path",
  discord: "ds_path",
};

const flowKeys = {
  google: "connect_google",
  twitter: "connect_twitter",
  telegram: "connect_telegram",
  discord: "connect_discord",
};

const useSocialCallback = () => {
  const { query, push } = useRouter();

  const getRedirectPath = useCallback(async () => {
    const localStorageKey = localStorageKeys[query.id as string];

    const windowOauthVerifier = getQueryVariable("oauth_verifier");
    const windowOauthToken = getQueryVariable("oauth_token");
    const windowCode = getQueryVariable("code");
    const windowDenied = getQueryVariable("denied");
    const windowError = getQueryVariable("error");

    const oauthVerifier = query.oauth_verifier || windowOauthVerifier;
    const oauthToken = query.oauth_token || windowOauthToken;
    const code = query.code || windowCode;
    const denied = query.denied || windowDenied;
    const error = query.error || windowError;

    const redirectPath = await LocalStorageService.getItemAsync(
      localStorageKey,
    );

    if (
      !localStorageKey ||
      !(oauthVerifier || oauthToken || code) ||
      denied ||
      error
    ) {
      push(redirectPath || "/");

      return;
    }

    push(
      `${redirectPath || "/"}?flow=${
        flowKeys[query.id as string]
      }&oauth_verifier=${oauthVerifier}&oauth_token=${oauthToken}&code=${code}`,
    );
  }, [
    query.id,
    query.oauth_verifier,
    query.oauth_token,
    query.code,
    query.denied,
    query.error,
    push,
  ]);

  useEffect(() => {
    getRedirectPath();
  }, [getRedirectPath]);
};

export default useSocialCallback;
