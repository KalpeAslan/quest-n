import { ExperienceProgressByDateStyles } from "@modules/account/components/experience/experienceProgressByDate/ExperienceProgressByDate.styles";
import { Box, Divider, Theme, useMediaQuery } from "@mui/material";
import { Trans } from "@lingui/macro";
import Button from "@components/UI/button/Button";
import { DailyLoginExp } from "@modules/account/models";
import { FC, useCallback, useMemo, useState } from "react";
import { LoggerService } from "@services";
import { experienceService } from "@api";
import { CBreakpoints } from "@styles/variables";
import Icon from "@components/UI/icon/Icon";
import { DailyExpPopup } from "../../dailyExpPopup";

interface IProps {
  data: DailyLoginExp[];
  onSubmit: () => void;
  isStarterClaimed: boolean;
  showTour?: boolean;
}

export const ExperienceProgressByDate: FC<IProps> = ({
  data,
  onSubmit,
  isStarterClaimed,
  showTour,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  const renderDayBlock = (day: DailyLoginExp, index: number) => {
    const computeOpacity = () => {
      if (day.isClaimed) return 0.5;
      // if (new Date().getDay() === index) return 1;
      if (day.completed) return 1;
      return 0.5;
    };

    return (
      <Box
        key={index}
        position={"relative"}
        sx={{
          opacity: computeOpacity(),
        }}
        className={
          day.isClaimed ? "day-block" : "day-block day-block__selected"
        }
      >
        <p className={"day"}>
          <Trans id={"sdjvkjnj34kan"}>Day {index}</Trans>
        </p>
        <Divider sx={{ my: "5px", width: "100%" }} />
        <p className={"exp"}>{`+${day.points}XP`}</p>
        {day.isClaimed && (
          <Box position={"absolute"} top={-9} right={-5}>
            <Icon name={"exp_check-mark"} />
          </Box>
        )}
      </Box>
    );
  };

  const onClick = useCallback(async () => {
    if (!isStarterClaimed) {
      setPopupOpen(true);
      return;
    }

    setLoading(true);
    try {
      await experienceService.claim().then(onSubmit);
    } catch (e) {
      LoggerService.error("Error while collecting daily experience", e);
    } finally {
      setLoading(false);
    }
  }, [isStarterClaimed, onSubmit]);

  const isMd = useMediaQuery<Theme>(theme =>
    theme.breakpoints.down(CBreakpoints.md),
  );

  const showButton = useMemo(
    () =>
      !isStarterClaimed ||
      (data ? data.find(item => item.completed && !item.isClaimed) : false),
    [data, isStarterClaimed],
  );

  return (
    <>
      <ExperienceProgressByDateStyles
        sx={{
          pointerEvents: showTour ? "none !important" : "auto",
          zIndex: showTour && 4,
        }}
        className={"background-other experience-progress-by-date"}
      >
        <div className={"experience-progress__wrapper"} id={"tour__exp-days"}>
          <Box
            className={"experience-progress-by-date__header"}
            width={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <p className={"c-font-color c-fw-500 c-font-20-20"}>
              <Trans id={"xcsjvnjkdfb-fdvjnqyj-23kjf"}>
                Signed in for{" "}
                <span className={"c-font-color-3"}>
                  {data &&
                    String(data.filter(item => item.completed).length || 1)}
                </span>{" "}
                consecutive days
              </Trans>
            </p>
            {!isMd && showButton && (
              <Button onClick={onClick} style={"colorfull"} loading={loading}>
                <Trans id={"sbdhv743kbvke-dfbku-1fe"}>
                  Collect Daily Experience
                </Trans>
              </Button>
            )}
          </Box>
          <Box
            mt={4}
            width={"100%"}
            className={"experience-progress-by-date__days"}
          >
            {data.slice(-7).map((exp, index) => renderDayBlock(exp, index + 1))}
          </Box>
          {isMd && showButton && (
            <Box mt={3}>
              <Button onClick={onClick} style={"colorfull"} loading={loading}>
                <Trans id={"sbdhv743kbvke-dfbku-1fe"}>
                  Collect Daily Experience
                </Trans>
              </Button>
            </Box>
          )}
        </div>
      </ExperienceProgressByDateStyles>

      <DailyExpPopup isOpen={popupOpen} setIsOpen={setPopupOpen} />
    </>
  );
};
