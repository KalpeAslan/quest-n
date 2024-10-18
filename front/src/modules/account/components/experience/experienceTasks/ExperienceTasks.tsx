import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { FC, useMemo, useState } from "react";
import Image from "next/image";
import Button from "../../../../../components/UI/button/Button";
import Icon from "@components/UI/icon/Icon";
import { CBreakpoints } from "@styles/variables";

interface ExperienceTask {
  id: number;
  name: string;
  points: number;
  body: any;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface IProps {
  data: ExperienceTask[];
  showTour: boolean;
}

const icons: Record<string, string> = {
  inviteReferral: "inviteReferral.svg",
  winLuckyDrawQuest: "winLuckyDrawQuest.svg",
  connect2fa: "connect2fa.svg",
  registerWithWallet: "registerWithWallet.svg",
  registerWithPhone: "registerWithPhone.svg",
  registerWithEmail: "registerWithEmail.svg",
  registerWithDiscord: "registerWithDiscord.svg",
  registerWithTwitter: "registerWithTwitter.svg",
  connectWallet: "connectWallet.svg",
  connectTelegram: "connectTelegram.svg",
  customTaskExperience: "exp_mark.svg",
  completeAllTasks: "exp_mark.svg",
  registerWithGoogle: "registerWithEmail.svg",
  connectDiscord: "registerWithDiscord.svg",
  winGuaranteedQuest: "winGuaranteedQuest.svg",
  winScoreboardQuest: "winScoreboardQuest.png",
  completeFirstTask: "exp_mark.svg",
  connectTwitter: "registerWithTwitter.svg",
  dailyVisit: "exp_calendar.svg",
};

export const ExperienceTasks: FC<IProps> = ({ data, showTour }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const groups = useMemo(() => {
    const result: ExperienceTask[][] = [];
    for (let i = 0; i < data.length; i += 2) {
      const chunk: ExperienceTask[] = data.slice(i, i + 2);
      result.push(chunk);
    }
    return result;
  }, [data]);

  const renderTask = (task: ExperienceTask) => {
    return (
      <Box
        className={"experience-task__item"}
        key={task.name}
        padding="15px 20px 20px 20px"
        border="1px solid rgba(255, 255, 255, 0.10)"
        bgcolor="#1e2121"
        borderRadius="16px"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="start"
          gap="10px"
        >
          <Box
            width={45}
            height={45}
            bgcolor="#1f2924"
            borderRadius={100}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              width={24}
              height={24}
              src={`/images/profile/experience/${
                icons[task.type] || "exp_mark"
              }`}
              alt={task.type}
            />
          </Box>
          <p className="c-font-color c-fw-400 c-font-16-16">{task.name}</p>
        </Box>
        <Box mt={1.5} className="c-font-color-3 c-font-20-20 c-fw-500">
          {`+${task.points}XP`}
        </Box>
      </Box>
    );
  };

  const handlePrev = () => {
    setActiveSlide(prev => {
      if (prev === 0) return groups.length - 1;
      return prev > 0 ? prev - 1 : 0;
    });
  };

  const handleNext = () => {
    setActiveSlide(prev => {
      if (prev === groups.length - 1) return 0;
      return prev < groups.length - 1 ? prev + 1 : prev;
    });
  };

  return (
    <Box
      sx={{
        pointerEvents: showTour ? "none !important" : "auto",
        zIndex: showTour && 4,
        '*': {
          pointerEvents: showTour ? "none !important" : "auto",
        }
      }}
      id={"tour__exp-tasks"}
      overflow={"hidden"}
      maxWidth={showTour ? 740 : 760}
    >
      <p className="c-fw-500 c-font-color c-font-20-20">
        <Trans id="lheg3-efblndf-24sdvs">How to earn Experience Points</Trans>
      </p>
      <Box mt={4} position="relative" overflow="hidden">
        <Box
          display="flex"
          width={`${100 * groups.length}%`}
          overflow={"hidden"}
          sx={{
            transition: "transform 0.5s ease",
            transform: `translateX(-${(100 * activeSlide) / groups.length}%)`,
          }}
        >
          {groups.map((group, index) => (
            <Box
              key={index}
              width={`${100 / groups.length}%`}
              display="flex"
              gap={2}
              sx={theme => ({
                ".experience-task__item": {
                  width: "50%",
                },
                [theme.breakpoints.down(CBreakpoints.sm)]: {
                  flexDirection: "column",
                  marginRight: 1,
                  ".experience-task__item": {
                    width: "100%",
                  },
                },
              })}
            >
              {group.map(task => renderTask(task))}
            </Box>
          ))}
        </Box>

        {data.length > 3 && (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={1}
            mt={4}
          >
            <Button onClick={handlePrev} size={"small"} style={"secondary"}>
              <Icon className={"c-flex"} name={"arrow-keyboard-left"} />
            </Button>

            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={"15px"}
            >
              {[...Array(Math.round(data.length / 2)).keys()].map(item => {
                const isSeleted = item === activeSlide;
                return (
                  <Box
                    key={item}
                    bgcolor={"var(--color-gr2)"}
                    width={isSeleted ? 10 : 7}
                    height={isSeleted ? 10 : 7}
                    className={"c-pointer"}
                    onClick={() => setActiveSlide(item)}
                    borderRadius={100}
                    sx={{
                      opacity: isSeleted ? 1 : 0.5,
                    }}
                  />
                );
              })}
            </Box>

            <Button onClick={handleNext} size={"small"} style={"secondary"}>
              <Icon className={"c-flex"} name={"arrow-keyboard-right"} />
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
