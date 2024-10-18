import { Box } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { ExperienceLevelsStyles } from "@modules/account/components/experience/experienceLevels/ExperienceLevels.styles";
import { FC } from "react";
import { LevelExp } from "@modules/account/models";
import Image from "next/image";
import { appConfig } from "@/app.config";
import Icon from "@components/UI/icon/Icon";
import { Tooltip } from "@/components/UI/tooltip";

interface IProps {
  data: LevelExp[];
  currentPoints: number;
  setLevelsPopupOpen: (value: boolean) => void;
  isStarterClaimed: boolean;
  showTour?: boolean;
}

export const ExperienceLevels: FC<IProps> = ({
  data,
  currentPoints,
  setLevelsPopupOpen,
  isStarterClaimed,
  showTour,
}) => {
  const renderLevel = (level: LevelExp, index: number) => {
    const isCurrentLevel =
      currentPoints >= level.pointsFrom &&
      currentPoints <= level.pointsTo &&
      isStarterClaimed;
    return (
      <Box
        display={"inline-flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        key={index}
        position={"relative"}
      >
        <Box position="relative">
          {!isCurrentLevel && (
            <div className={"lock"} style={{ opacity: 1 }}>
              <Icon
                style={{ opacity: 1 }}
                name={"profile-lock"}
                size={"19"}
                className={"c-font-color"}
              />
            </div>
          )}
          <Image
            src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${level.image}`}
            alt={"Level"}
            width={55}
            height={55}
            className={"border-radius-img"}
            style={{
              opacity: isCurrentLevel ? 1 : 0.5,
            }}
          />
        </Box>
        <Box
          className={"c-font-color c-font-12-12 c-fw-400"}
          component={"p"}
          mt={1.2}
          mb={0.5}
        >
          {level.name}
        </Box>
        <Box
          display={"inline-block"}
          textAlign={"center"}
          bgcolor={"rgba(255, 255, 255, 0.10)"}
          borderRadius={"6px"}
        >
          <Box
            component={"p"}
            p={0.5}
            className={"c-font-color-3 c-font-12-12"}
          >
            {index
              ? t({
                  id: "fHtwtrFPyXuHhhfT1NX4oh-experienceLevels",
                  message: `≥${level.pointsTo} XP`,
                })
              : t({
                  id: "kA1qMDV8GJpXU2bpd8un5N-experienceLevels",
                  message: `<${level.pointsTo} XP`,
                })}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <ExperienceLevelsStyles isInTour={showTour}>
      <div id={"tour__exp-levels"} className={"tour__exp-levels__wrapper"}>
        <Box
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <p className={"c-font-color c-fw-500 c-font-20-20"}>
            <Trans id={"vjghsjvnjkdfb-fdvjnqyj-23kjf"}>Levels</Trans>
          </p>
          <Box
            className={"c-pointer c-font-color c-font-20-14 c-fw-500"}
            sx={{
              textDecoration: "underline",
            }}
            onClick={() => setLevelsPopupOpen(true)}
          >
            <Trans id={"dfg30lw-djvdkb-24kbnf"}>Benefits</Trans>
          </Box>
        </Box>
        <Box mt={4}>
          <Box
            sx={{
              overflowX: "auto",
              pointerEvents: showTour ? "none !important" : "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                minWidth: 700,
                justifyContent: "space-between",
                overflowY: "hidden",
                overflowX: "auto",
                gap: 3,
              }}
            >
              {data.map((item, index) =>
                isStarterClaimed ? (
                  renderLevel(item, index)
                ) : (
                  <Tooltip
                    key={index}
                    value={
                      <Box className="c-font-12-16">
                        <Trans id="evDCWELSfbrnEefcgr5hjE-experienceLevels">
                          You need to claim your AlphaGuilty
                          <br />
                          Profile in order to get a level
                        </Trans>
                      </Box>
                    }
                    placement="top"
                    followCursor
                  >
                    {renderLevel(item, index)}
                  </Tooltip>
                ),
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </ExperienceLevelsStyles>
  );
};
