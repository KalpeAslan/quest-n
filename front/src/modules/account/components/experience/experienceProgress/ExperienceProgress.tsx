import { ExperienceProgressStyles } from "@modules/account/components/experience/experienceProgress/ExperienceProgress.styles";
import { ExperienceAvatar } from "@modules/account/components/experience/ExperienceAvatar/ExperienceAvatar";
import { Box, LinearProgress, Theme, useMediaQuery } from "@mui/material";
import { Trans } from "@lingui/macro";
import ExpHistoryPopup from "../../expHistoryPopup/ExpHistoryPopup";
import { FC, useState } from "react";
import { LevelExp } from "@modules/account/models";
import { appConfig } from "@/app.config";
import Image from "next/image";
import { ExperienceClaimPopup } from "@modules/account/components/experience/experienceClaimPopup/ExperienceClaimPopup";
import useClaimExperienceStarter from "@hooks/useClaimExperienceStarter";
import Button from "@components/UI/button/Button";
import { ConnectWalletPopup } from "@components/ConnectWalletPopup";
import { CBreakpoints } from "@styles/variables";

interface IProps {
  totalPoints: number;
  nextLevel: null | LevelExp;
  currentLevel: LevelExp;
  notClaimedNextLevel: LevelExp | null;
  disabled: boolean;
  showTour: boolean;
  onClaimed: () => void;
}

export const ExperienceProgress: FC<IProps> = ({
  totalPoints,
  nextLevel,
  currentLevel,
  disabled,
  notClaimedNextLevel,
  showTour,
  onClaimed,
}) => {
  const [openHistory, setOpenHistory] = useState(false);
  const [levelUpLoading, setLevelUpLoading] = useState(false);
  const max = nextLevel ? nextLevel.pointsTo : 100;
  const min = nextLevel ? nextLevel.pointsFrom : 0;
  const normalise = value => ((value - min) * 100) / (max - min);

  const {
    claim,
    isWalletPopupOpen,
    getNeedSwitchChain,
    setIsWalletPopupOpen,
    needConnect,
    chainToConnect,
    isShowClaimModal,
    setIsShowClaimModal,
  } = useClaimExperienceStarter();

  const showClaimButton = () => {
    if (!notClaimedNextLevel) return false;
    return notClaimedNextLevel.pointsFrom <= totalPoints;
  };

  const handleLevelUp = async () => {
    try {
      setLevelUpLoading(true);
      setIsShowClaimModal(true);
      await claim();
      onClaimed();
    } catch (e) {
      setLevelUpLoading(false);
      setIsShowClaimModal(false);
    } finally {
      setLevelUpLoading(false);
    }
  };
  const isMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.md),
  );

  const claimContent = () => {
    return (
      <Box
        sx={theme => ({
          // display={"flex"} alignItems={"center"} justifyContent={"left"}
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          gap: 2,
          [theme.breakpoints.down(CBreakpoints.md)]: {
            flexDirection: "column",
            alignItems: "flex-start",
          },
        })}
      >
        <Box component={"p"} className={"c-font-color"}>
          Level Up claiming and the {notClaimedNextLevel.name + ""} <br />
          bonuses!
        </Box>

        <Button
          loading={levelUpLoading}
          size={"small"}
          onClick={handleLevelUp}
          style={"primary"}
        >
          Level Up
        </Button>
      </Box>
    );
  };

  return (
    <>
      <ExperienceProgressStyles
        sx={{
          pointerEvents: showTour ? "none !important" : "auto",
          zIndex: showTour && 4,
        }}
        id={"tour__exp-progress__container"}
      >
        <Box
          className="backgroundImage"
          overflow={"hidden"}
          borderRadius={"16px"}
        >
          <Image
            src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${currentLevel.image}`}
            alt={currentLevel.name}
            fill
            style={{ objectFit: "cover", borderRadius: 16 }}
          />
        </Box>
        <Box className="backgroundFilter" id={"tour__exp-progress"} />
        <Box display={"flex"} alignItems={"center"} zIndex={1}>
          <ExperienceAvatar
            size={"large"}
            disabled={disabled}
            src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${currentLevel.image}`}
          />
          {showClaimButton() && !isMd ? (
            <Box
              borderRadius={2}
              pl={9}
              bgcolor={"#101313"}
              py={1}
              position={"absolute"}
              left={90}
              zIndex={-1}
              pr={2}
              border={"1px solid rgba(255, 255, 255, 0.10)"}
              sx={theme => ({
                [theme.breakpoints.up(CBreakpoints.lg)]: {
                  paddingLeft: 4,
                },
                [theme.breakpoints.up(CBreakpoints.xLg)]: {
                  paddingLeft: 9,
                },
              })}
            >
              {claimContent()}
            </Box>
          ) : (
            <Box
              component={"p"}
              ml={2}
              className={"c-font-color c-font-24-24 c-fw-500"}
            >
              {currentLevel.name}
            </Box>
          )}
        </Box>
        {showClaimButton() && isMd && (
          <Box
            borderRadius={2}
            bgcolor={"#101313"}
            py={1}
            zIndex={2}
            px={2}
            maxWidth={400}
            border={"1px solid rgba(255, 255, 255, 0.10)"}
          >
            {claimContent()}
          </Box>
        )}
        <Box
          zIndex={1}
          className={"c-pointer c-font-color c-font-20-14 c-fw-500"}
          sx={theme => ({
            textDecoration: "underline",
            [theme.breakpoints.up(CBreakpoints.lg)]: {
              top: 10,
            },
            [theme.breakpoints.up(CBreakpoints.xLg)]: {
              top: 20,
            },
          })}
          right={20}
          top={20}
          onClick={() => setOpenHistory(true)}
          position={"absolute"}
        >
          <Trans id={"dfbvkj-34jndfv-asnvsdjv"}>History</Trans>
        </Box>
        <Box mt={3} zIndex={1}>
          <Box>
            <Box>
              <Box
                className={"c-font-color-3 c-font-20-20 c-fw-500"}
                component={"span"}
                mr={1}
              >{`${Math.floor(totalPoints)} XP`}</Box>
              <span
                className={"c-font-color c-font-20-20 c-fw-400"}
              >{`/ ${nextLevel.pointsFrom} XP`}</span>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <LinearProgress
                sx={{ width: "100%" }}
                variant="determinate"
                value={normalise(totalPoints)}
              />
              <Box ml={1}>
                <ExperienceAvatar
                  size={"small"}
                  src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${nextLevel.image}`}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </ExperienceProgressStyles>
      <ExpHistoryPopup isOpen={openHistory} setIsOpen={setOpenHistory} />
      {notClaimedNextLevel && (
        <ExperienceClaimPopup
          exp={notClaimedNextLevel}
          isOpen={isShowClaimModal}
          handleClose={() => setIsShowClaimModal(false)}
        />
      )}
      {isWalletPopupOpen && (
        <ConnectWalletPopup
          isOpen={isWalletPopupOpen}
          handleClose={() => {
            setIsWalletPopupOpen(false);
            setIsShowClaimModal(false);
            setLevelUpLoading(false);
          }}
          chainToConnect={chainToConnect}
          needConnect={needConnect}
          needSwitchChain={getNeedSwitchChain(
            notClaimedNextLevel.chainId as any,
          )}
          actionName={"Level Up Claiming"}
        />
      )}
    </>
  );
};
