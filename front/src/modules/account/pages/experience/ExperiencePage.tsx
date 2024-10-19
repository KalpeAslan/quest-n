import { useEffect, useMemo, useState } from "react";
import { useContextSelector } from "use-context-selector";
import classnames from "classnames";
import { Box, Theme, useMediaQuery } from "@mui/material";

import { AppContext } from "@context";
import { ExperiencePageStyles } from "./experiencePage.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountState } from "@modules/account/store/account.selector";
import dynamic from "next/dynamic";
import { NextPage } from "next";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { t, Trans } from "@lingui/macro";
import {
  useGetProfileExpQuery,
  useGetUserAnalyticsInfoQuery,
  useGetUserProfileQuery,
  useGetUserSettingsModalQuery,
} from "@modules/account/store/account.api";
import { PageLoader } from "@/components/pageLoader";
import { CBreakpoints } from "@styles/variables";
import { ExperienceProgress } from "@modules/account/components/experience/experienceProgress/ExperienceProgress";
import { ExperienceProgressByDate } from "@modules/account/components/experience/experienceProgressByDate/ExperienceProgressByDate";
import { ExperienceLevels } from "@modules/account/components/experience/experienceLevels/ExperienceLevels";
import { IUserExpData } from "@modules/account/models";
import { LevelsPopup } from "../../components/levelsPopup";
import { ExperienceTasks } from "@modules/account/components/experience/experienceTasks/ExperienceTasks";
import { useClaimExperienceStarter } from "@/hooks";
import { ExperienceTourModal } from "@modules/account/components/experience/experienceTour/ExperienceTourModal";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { EUserModalSettingsTypes } from "@models";
import { accountService } from "@api";
import {
  setFinishTourPopupOpen,
  setIsShowExperienceTour,
} from "@store/slices/system/system.slice";
import {
  getDisclaimerPopupOpen,
  getIsFinishPopupOpen,
  getIsShowExperienceTour,
} from "@store/slices/system/system.selector";
import { usePrivateRouteRedirect } from "@/hooks/usePrivateRouteRedirect";

const AccountBarLazy = dynamic(
  () =>
    import("@modules/account/components/accountBar").then(
      res => res.AccountBar,
    ),
  {
    ssr: false,
    loading: () => <PageLoader />,
  },
);

const ExperiencePage: NextPage = () => {
  const [levelsPopupOpen, setLevelsPopupOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const { accountInfo, isAccountLoaded } = useTypedSelector(getAccountState);

  const useGetProfileExpQuery1 = useGetProfileExpQuery(null);
  const data = useGetProfileExpQuery1.data as IUserExpData;
  const isLoading = useGetProfileExpQuery1.isLoading;
  const refetchExp = useGetProfileExpQuery1.refetch;

  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );

  const [tracked, setTracked] = useState(false);

  const { isClaimed: isStarterClaimed } = useClaimExperienceStarter();

  useGetUserProfileQuery(null, {
    skip: !accountInfo.connected,
  });
  useGetUserAnalyticsInfoQuery(null, {
    skip: !accountInfo.connected,
  });

  useEffect(() => {
    return () => {
      if (prevLocation) {
        prevLocation.current = location.pathname;
      }
    };
  }, []);

  useEffect(() => {
    if (!isAccountLoaded || tracked) return;

    dispatch(
      sendAnalyticsDataThunk({
        type: "account_screen_view",
        options: { event_property_current_page: "/profile/e" },
      }),
    );
    setTracked(true);
  }, [isAccountLoaded, dispatch, accountInfo, tracked]);

  usePrivateRouteRedirect();

  const isMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.md),
  );

  const isOpenDisclaimer = useTypedSelector(getDisclaimerPopupOpen);
  const showTour = useTypedSelector(getIsShowExperienceTour);
  const setShowTour = (value: boolean) => {
    dispatch(setIsShowExperienceTour(value));
  };
  const [showTourModal, setShowTourModal] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<string>("");

  const { data: userModalSetting, isLoading: userModalSettingLoading } =
    useGetUserSettingsModalQuery(EUserModalSettingsTypes.EXP_TOUR, {
      skip: !accountInfo.connected,
      refetchOnMountOrArgChange: true,
    });

  const isFinishPopupOpen = useTypedSelector(getIsFinishPopupOpen);

  useEffect(() => {
    if (userModalSetting) {
      setShowTourModal(false);
    }
    if (userModalSetting === null) {
      setShowTourModal(true);
    }
  }, [userModalSetting, userModalSettingLoading]);

  const finishTour = () => {
    accountService.readUserSettingsModal(EUserModalSettingsTypes.EXP_TOUR);
    driverObj.destroy();
    setShowTour(false);
    setShowTourModal(false);
    dispatch(setFinishTourPopupOpen(true));
  };

  const driverObj = useMemo(
    () =>
      driver({
        popoverClass: "driverjs-theme",
        allowClose: false,
        showButtons: ["previous", "next"],
        prevBtnText: t({
          id: "x439df23kdsfh432-sjvi1xxvdjnvu",
          message: "Previous",
        }),
        nextBtnText: t({
          message: "Continue",
          id: "xxsxxxjkdsfh432-sjvi1xxvdjnvu",
        }),
        doneBtnText: "Finish",
        onDestroyed: () => {
          setShowTour(false);
        },
        onPopoverRender: () => {
          const prevButton = document.querySelector(".driver-popover-prev-btn");
          prevButton.classList.add("d-hidden");
        },
        onNextClick() {
          const selector = (() => {
            if (driverObj.getActiveStep().element === "#tour__exp-progress")
              return "#tour__exp-progress__container";
            return driverObj.getActiveStep().element;
          })();
          const element = document.querySelector(selector as string);
          if (element) {
            element.classList.add("fade-out-animation");
            setTimeout(() => {
              element.classList.remove("fade-out-animation");
            }, 400);
            setTimeout(() => {
              driverObj.moveNext();
            }, 300);
          }
        },
        steps: [
          {
            element: "#tour__exp-progress",
            popover: {
              title: "",
              description: t({
                id: "jkhfk12-32bfvkhas122-xask",
                message: `This is your level bar. Here you can see how much experience you currently have and how many more points you need to reach the next level.`,
              }),
              align: "end",
              side: "bottom",
            },
            onHighlighted() {
              setActiveStep("tour__exp-progress");
            },
          },
          {
            element: "#tour__exp-days",
            popover: {
              title: "",
              description: t({
                id: "jxsaukhfk12-32bfvkhas122-xask",
                message: `Here you can earn experience points for logging into the platform every day.`,
              }),
              align: "end",
              side: "bottom",
            },
            onHighlighted() {
              const prevButton = document.querySelector(
                ".driver-popover-prev-btn",
              );
              prevButton.classList.remove("d-hidden");
              setActiveStep("tour__exp-days");
            },
          },
          {
            element: "#tour__exp-levels",
            popover: {
              title: "",
              description: t({
                id: "xjkhfk12-32bfvkhas122-xask",
                message: `These are the levels you can reach by gaining experience points. Each new level gives you new advantages for participating in quests.`,
              }),
              align: "end",
              side: "bottom",
            },
            onHighlighted() {
              const prevButton = document.querySelector(
                ".driver-popover-prev-btn",
              );
              prevButton.classList.remove("d-hidden");
              setActiveStep("tour__exp-levels");
            },
          },
          {
            element: "#tour__exp-tasks",
            popover: {
              title: "",
              description: t({
                id: "2xdvfsxjkhfk12-32bfvkhas122-xask",
                message: `You also have tips on how you can earn experience points.`,
              }),
              align: "end",
              side: "bottom",
              onNextClick() {
                finishTour();
              },
            },
            onHighlighted() {
              const prevButton = document.querySelector(
                ".driver-popover-prev-btn",
              );
              prevButton.classList.remove("d-hidden");
              setActiveStep("tour__exp-tasks");
            },
          },
        ],
      }),
    [data],
  );

  useEffect(() => {
    if (showTour && !isOpenDisclaimer) {
      driverObj.drive();
    }
  }, [showTour, isOpenDisclaimer]);

  const computeShowTour = elementId => activeStep === elementId && showTour;

  return (
    <div className="background-other">
      <ExperiencePageStyles
        isBlurred={showTour || isFinishPopupOpen}
        fadeOutTime={FadeOutTime}
        mt={5}
        mb={isMd ? 16 : 5}
      >
        <LevelsPopup
          isOpen={levelsPopupOpen}
          setIsOpen={setLevelsPopupOpen}
          levels={data?.levels || []}
        />
        <Box mb={{ xs: 2, md: 3 }}>
          <Box
            className={classnames(
              "header",
              "c-font-32-38 c-fw-500 c-font-color",
            )}
            component="h3"
          >
            <Trans id={"vdfdshfjk-234hkjdf"}>Experience System</Trans>
          </Box>
        </Box>

        <Box className="sticky">
          <AccountBarLazy />
        </Box>

        {/*<Box className="blocks">*/}
        {/*  {isLoading ? (*/}
        {/*    <PageLoader />*/}
        {/*  ) : (*/}
        {/*    <>*/}
        {/*      {data.nextLevel && (*/}
        {/*        <ExperienceProgress*/}
        {/*          nextLevel={data.nextLevel}*/}
        {/*          notClaimedNextLevel={data.nextLevel}*/}
        {/*          totalPoints={data.totalExpPoints}*/}
        {/*          currentLevel={data.currentLevel}*/}
        {/*          showTour={computeShowTour("tour__exp-progress")}*/}
        {/*          disabled={!data.levels[0].isClaimed}*/}
        {/*          onClaimed={() => refetchExp()}*/}
        {/*        />*/}
        {/*      )}*/}
        {/*      <ExperienceProgressByDate*/}
        {/*        data={data.dailyVisitData}*/}
        {/*        onSubmit={useGetProfileExpQuery1.refetch}*/}
        {/*        isStarterClaimed={isStarterClaimed}*/}
        {/*        showTour={computeShowTour("tour__exp-days")}*/}
        {/*      />*/}
        {/*      <ExperienceLevels*/}
        {/*        currentPoints={data.totalExpPoints}*/}
        {/*        data={data.levels}*/}
        {/*        showTour={computeShowTour("tour__exp-levels")}*/}
        {/*        setLevelsPopupOpen={setLevelsPopupOpen}*/}
        {/*        isStarterClaimed={isStarterClaimed}*/}
        {/*      />*/}
        {/*      <ExperienceTasks*/}
        {/*        showTour={computeShowTour("tour__exp-tasks")}*/}
        {/*        data={data.notCompletedExpTasks}*/}
        {/*      />*/}
        {/*      <ExperienceTourModal*/}
        {/*        handleShowTour={() => {*/}
        {/*          setShowTourModal(false);*/}
        {/*          setShowTour(true);*/}
        {/*        }}*/}
        {/*        handleSkip={finishTour}*/}
        {/*        handleClose={() => setShowTourModal(false)}*/}
        {/*        isOpen={showTourModal}*/}
        {/*      />*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*</Box>*/}
      </ExperiencePageStyles>
    </div>
  );
};

const FadeOutTime = 200;

export default ExperiencePage;
