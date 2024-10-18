import { ShowMore } from "@/components/UI/showMore";
import { Box } from "@mui/material";
import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import { gameDesktop, gameMobile } from "../../assets";
import { Wrapper } from "./gamePageContent.styles";
import { Trans } from "@lingui/macro";

const GamePageContent = () => {
  const [isShowMore, setIsShowMore] = useState<boolean>(false);

  return (
    <Wrapper className="c-wrap">
      <Box>
        <Box
          component="h1"
          className="c-font-30-36 c-fw-500 c-font-color"
          mb={3.75}
        >
          <Trans id="3DyFuVNbCqzsBvkA1syfA1-games">F777 Fighter</Trans>
        </Box>

        <Box component="p" className="c-font-16-25 c-font-color">
          <Box component="p" className="c-font-color-3" mb="25px">
            <Trans id="eMm8BYt3PTygohvH7bSEea-games">
              Don&apos;t wait till the end of the quest - get more AQ by playing
              games!
            </Trans>
          </Box>

          <Box component="p" mb="25px">
            <Trans id="tYmsHVZ1Uqxv2faJYEyjvL-games">
              F777 Fighter is a new and unique type of online games, made in
              military aircraft design. It is a multiplayer game that has many
              similar features with crash games.
            </Trans>
          </Box>

          <Box component="p" mb="25px">
            <Trans id="u8HiNP426yzma7f5w1eCfe-games">
              Main game becomes even more exciting when there is a chance to win
              the Jackpot. Onlyplay games have different Jackpot mechanics; it
              can be accumulative or absolutely random. Every player finds the
              game with a jackpot fitting his interests.
            </Trans>
          </Box>

          <Box className="mobile">
            <ShowMore
              isOpened={isShowMore}
              setIsOpened={setIsShowMore}
              headerClassName={classNames("show-more-btn", {
                opened: isShowMore,
              })}
            >
              <Box component="p" mb="25px">
                <Trans id="dnRnb4ciKB6KpEiGKS7ven-games">
                  The Jackpot may be won after the multiplier coefficient in the
                  game exceeds 3.00. The exact game session and moment of the
                  Jackpot win is determined by a random number generator.
                  Fighter is the multiplayer game, so the Jackpot may be won by
                  all the players that during the corresponding game session do
                  not end the game round by taking the Win after the multiplier
                  coefficient exceeded 3.00 and prior to the moment when Jackpot
                  win occurred.
                </Trans>
              </Box>
              <Box component="p">
                <Trans id="9uwaW2rdMLxgCZKnLE2PVy-games">
                  F777 Fighter game offers you an opportunity to make 2 bets
                  simultaneously and win more. To enable this feature you have
                  to click on the &quot;+&quot; button that is located on the
                  right of the Make Bet button and the second Bet sector will
                  automatically appear.
                </Trans>
              </Box>
            </ShowMore>
          </Box>

          <Box className="desktop">
            <Box component="p" mb="25px">
              <Trans id="7GxPhnbua8L8zpXSVf5sgR-games">
                The Jackpot may be won after the multiplier coefficient in the
                game exceeds 3.00. The exact game session and moment of the
                Jackpot win is determined by a random number generator. Fighter
                is the multiplayer game, so the Jackpot may be won by all the
                players that during the corresponding game session do not end
                the game round by taking the Win after the multiplier
                coefficient exceeded 3.00 and prior to the moment when Jackpot
                win occurred.
              </Trans>
            </Box>
            <Box component="p">
              <Trans id="qk2vZ62zJZ96Xc7ZqsWT8A-games">
                F777 Fighter game offers you an opportunity to make 2 bets
                simultaneously and win more. To enable this feature you have to
                click on the &quot;+&quot; button that is located on the right
                of the Make Bet button and the second Bet sector will
                automatically appear.
              </Trans>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="imageWrapper">
        <Image
          className="image mobile"
          src={gameMobile}
          title="Game"
          alt="game"
        />

        <Image
          className="image desktop"
          src={gameDesktop}
          title="Game"
          alt="game"
        />
      </Box>
    </Wrapper>
  );
};

export default GamePageContent;
