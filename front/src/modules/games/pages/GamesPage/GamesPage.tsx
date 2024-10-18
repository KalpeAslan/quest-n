import { Wrapper } from "./gamesPage.styles";
import { GamePageContent } from "../../components/GamePageContent";
import { useGetUserProfileQuery } from "@/modules/account/store/account.api";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@/modules/account/store/account.selector";
import { Box } from "@mui/material";
import Image from "next/image";
import { gamePlaceholderDesktop, gamePlaceholderMobile } from "../../assets";
import { Button } from "@/components/UI/button";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { gamesService } from "@/api";
import { t } from "@lingui/macro";

const GamesPage = () => {
  const { push } = useRouter();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const accountInfo = useTypedSelector(getAccountInfo);

  useGetUserProfileQuery(null, {
    skip: !accountInfo.connected,
  });

  const getIframe = useCallback(async () => {
    if (!accountInfo.connected || !accountInfo?.questInfo?.questProfit) return;
    try {
      const { data } = await gamesService.getIframe("fighter");

      setIframeUrl(data.url);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoaded(true);
    }
  }, [accountInfo]);

  useEffect(() => {
    getIframe();
  }, [getIframe]);

  return (
    <div className="background-other">
      <Wrapper component="section">
        <Box className="heroWrapper c-full-width">
          {!isLoaded || !iframeUrl ? (
            <>
              <Image
                src={gamePlaceholderMobile}
                title="Game"
                alt="Game"
                className="heroImage mobile"
              />

              <Image
                src={gamePlaceholderDesktop}
                title="Game"
                alt="Game"
                className="heroImage desktop"
              />
            </>
          ) : (
            <>
              <iframe src={iframeUrl} title="Game" className="iframe" />
            </>
          )}

          {(!accountInfo.connected || !accountInfo?.questInfo?.questProfit) && (
            <Box className="heroContent">
              <Box
                className="c-font-color c-font-32-38 c-fw-500"
                mb="23px"
                textAlign="center"
              >
                {!accountInfo.connected &&
                  t({
                    id: "c8SuhEJrYBujcMwQ2JLHWD-games",
                    message: "Login or Sign Up to be able to play",
                  })}
                {!accountInfo?.questInfo?.questProfit &&
                  accountInfo.connected &&
                  t({
                    id: "nU5rmwCVbaqaRJCYwh5Kgq-games",
                    message: "Get first AQ tokens to be able to play",
                  })}
              </Box>

              <Button
                style="colorfull"
                className="heroButton"
                onClick={() => {
                  if (!accountInfo.connected) push("/sign-up");
                  else push("/explore");
                }}
              >
                <>
                  {!accountInfo.connected &&
                    t({
                      id: "pouJmyNDRm1KnWk8fL3U9p-games",
                      message: "Login or Sign Up",
                    })}
                  {!accountInfo?.questInfo?.questProfit &&
                    accountInfo.connected &&
                    t({
                      id: "cVCZj2dhRBajJ5N6UgfBKa-games",
                      message: "Earn AQ tokens",
                    })}
                </>
              </Button>
            </Box>
          )}
        </Box>

        <GamePageContent />
      </Wrapper>
    </div>
  );
};

export default GamesPage;
