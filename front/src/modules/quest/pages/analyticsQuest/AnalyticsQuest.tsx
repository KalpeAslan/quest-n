import { AnalyticsQuestStyles } from "@modules/quest/pages/analyticsQuest/AnalyticsQuest.styles";
import Button from "@components/UI/button/Button";
import Icon from "@components/UI/icon/Icon";
import { t, Trans } from "@lingui/macro";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { QuestAnalyticItem } from "@modules/quest/components/questAnalyticItem/QuestAnalyticItem";
import {
  useGetQuestAnalyticsQuery,
  useGetQuestCompletionAnalyticsTasksQuery,
} from "@modules/quest/hooks/quest.api";
import { IQuestAnalytics, IQuestTasksCompletion } from "@models";
import { QuestCompletedTasks } from "@modules/quest/components/questCompletedTasks/QuestCompletedTasks";
import { QuestTasksCompletionChartAnalytics } from "@modules/quest/components/questTasksCompletionChartAnalytics/QuestTasksCompletionChartAnalytics";
import { QuestTasksCountCompletedChartAnalytics } from "@modules/quest/components/questTasksCountCompletedChartAnalytics/QuestTasksCountCompletedChartAnalytics";
import { QuestAnalyticsWinnersAndEligibleUsers } from "../../components/QuestAnalyticsTables/QuestAnalyticsWinnersAndEligibleUsers";
import { QuestAnalyticsGeography } from "../../components/questAnalyticsGeography/QuestAnalyticsGeography";
import { useRouter } from "next/router";
import BreadCrumbs from "../../../../components/breadCrumbs/BreadCrumbs";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getPartnerProject } from "@modules/account/store/account.selector";
import { useEffect, useState } from "react";
import { nextTick } from "@/utils";
import { PartnerProjectsDropdown } from "@modules/quest/components/partnerProjectsDropdown/PartnerProjectsDropdown";
import { CBreakpoints } from "@styles/variables";
import { usePrivateRouteRedirect } from "@/hooks/usePrivateRouteRedirect";
import PageLoader from "@components/pageLoader/PageLoader";

interface IProps {
  questLinkTitle: string;
  partnerProjectLinkTitle: string;
}

export const CHARTS_MIN_WIDTH = 500;

export const AnalyticsQuest = ({
  questLinkTitle,
  partnerProjectLinkTitle,
}: IProps) => {
  const { data: rawData, isError } = useGetQuestAnalyticsQuery(questLinkTitle, {
    skip: !questLinkTitle,
  });

  const data = rawData as IQuestAnalytics | null;
  const [minHeightOfPage, setMinHeightOfPage] = useState(0);

  const analyticsTasksQuery =
    useGetQuestCompletionAnalyticsTasksQuery(questLinkTitle);
  const analyticsTasksQueryData =
    analyticsTasksQuery.data as IQuestTasksCompletion;

  const { push, back, asPath, route, query } = useRouter();

  const currentProject = useTypedSelector(
    getPartnerProject((query as any).linkTitle),
  );

  const handleGoBack = () => {
    if (asPath === route) {
      push("/admin/projects");
    } else {
      back();
    }
  };

  const calculateConversationPercentage = () => {
    if (!data) return 0;
    if (+data.visits === 0) {
      return 0;
    }
    if (+data.participants === 0) return 0;

    const conversationRatio = +data.participants / +data.visits;
    const conversationPercentage = conversationRatio * 100;

    return conversationPercentage.toFixed(2);
  };

  const computeHeightOfPage = () => {
    const anchors = document.querySelectorAll(".quest-analytics__anchor");
    const computedHeight = Array.from(anchors).reduce((acc, anchor) => {
      return acc + anchor.clientHeight;
    }, 0);
    const marginsAndPaddings = 524;
    return computedHeight + marginsAndPaddings;
  };

  const isLessThanCHARTS_MIN_WIDTH = useMediaQuery(
    `(max-width: ${CHARTS_MIN_WIDTH}px)`,
  );
  const isLg = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(CBreakpoints.lg),
  );

  useEffect(() => {
    nextTick(() => {
      setMinHeightOfPage(computeHeightOfPage());
    });
  });

  useEffect(() => {
    if (isError) {
      push(`/admin/project/${partnerProjectLinkTitle}/quests`);
    }
  }, [isError]);

  usePrivateRouteRedirect();

  return (
    <AnalyticsQuestStyles
      chartsMinWidth={CHARTS_MIN_WIDTH}
      minHeight={minHeightOfPage}
    >
      {isLg && (
        <div className={"quest-analytics__sidebar"}>
          <Box p={2}>
            <PartnerProjectsDropdown />
          </Box>
        </div>
      )}
      {data ? (
        <div className="quest-analytics__content">
          {currentProject && data && (
            <Box className={"quest-analytics__anchor"} mb={3}>
              <BreadCrumbs
                links={[
                  {
                    title: t({
                      message: "Projects",
                      id: "blkfdb95-fglknf-f3gn4k-dfg",
                    }),
                    link: "/admin/projects",
                    id: 0,
                  },
                  {
                    title: currentProject.name,
                    link: `/admin/project/${currentProject.linkTitle}`,
                    id: 1,
                  },
                  {
                    title: t({
                      message: "Quest Statistics",
                      id: "dsk4-bdflkbn-fdbldnf-dfbpdfoj",
                    }),
                    link: asPath,
                    id: 3,
                  },
                ]}
              />
            </Box>
          )}

          <div className="analytics-header quest-analytics__anchor">
            <Button style="secondary" size={"small"} onClick={handleGoBack}>
              <Icon name="slider-arrow" size={"13"} className="backIcon" />
            </Button>

            <p
              className={
                "c-font-color quest-analytics__title c-font-32-38 c-fw-500"
              }
            >
              <Trans id={"kl34-dlflbndfgdf-dgdf-1mn_j43n"}>
                {data && data.title} Quest Statistic
              </Trans>
            </p>
          </div>
          <Box
            mt={5}
            display={"flex"}
            alignItems={"center"}
            gap={"20px"}
            justifyContent={"start"}
            className={"analytics-items quest-analytics__anchor"}
          >
            <QuestAnalyticItem
              type={"visitors"}
              value={data ? data.visits : ""}
            />
            <QuestAnalyticItem
              type={"participants"}
              value={data ? data.participants : ""}
            />
            <QuestAnalyticItem
              type={"conversions"}
              value={`${calculateConversationPercentage()} %`}
            />
          </Box>
          <Box width={"100%"} mt={6} className={"quest-analytics__anchor"}>
            <QuestCompletedTasks questLinkTitle={questLinkTitle} />
          </Box>
          {analyticsTasksQueryData && (
            <Box className={"quest-analytics__anchor"} mt={9}>
              <Box>
                <Box
                  component={"p"}
                  mb={3}
                  className={"c-font-color c-font-20-22 c-fw-500"}
                >
                  <Trans id={"sldkvslkdhk34-sdlnkb-34lkdnfb"}>
                    CR from Quest to task completion
                  </Trans>
                </Box>
                <QuestTasksCompletionChartAnalytics
                  data={analyticsTasksQueryData.tasksCompletion}
                />
                {isLessThanCHARTS_MIN_WIDTH && (
                  <Box
                    mt={3}
                    style={{ opacity: 0.5 }}
                    component={"p"}
                    className={"c-font-color c-font-16-18 c-fw-500"}
                  >
                    <Trans id={"lksfdj4-3lkebnfb-fdlkbndfb"}>
                      Scroll right to see more
                    </Trans>
                  </Box>
                )}
              </Box>

              <Box mt={9}>
                <Box
                  component={"p"}
                  mb={3}
                  className={"c-font-color c-font-20-22 c-fw-500"}
                >
                  <Trans id={"sldkvslkdhk34-sdlnkb-34lkdnfb"}>
                    CR from Quest to task completion
                  </Trans>
                </Box>
                {analyticsTasksQueryData.tasksCountCompletion &&
                  analyticsTasksQueryData.tasksCountCompletion.length && (
                    <QuestTasksCountCompletedChartAnalytics
                      data={analyticsTasksQueryData.tasksCountCompletion}
                    />
                  )}
                {isLessThanCHARTS_MIN_WIDTH && (
                  <Box
                    mt={3}
                    style={{ opacity: 0.5 }}
                    component={"p"}
                    className={"c-font-color c-font-16-18 c-fw-500"}
                  >
                    <Trans id={"lksfdj4-3lkebnfb-fdlkbndfb"}>
                      Scroll right to see more
                    </Trans>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          <Box className={"quest-analytics__anchor"} mt={7}>
            {data && <QuestAnalyticsGeography data={data.geography} />}
          </Box>

          <Box className={"c-full-width quest-analytics__anchor"} mt={10}>
            <QuestAnalyticsWinnersAndEligibleUsers
              questLinkTitle={questLinkTitle}
              questType={data ? data.questType : null}
            />
          </Box>
        </div>
      ) : (
        <PageLoader />
      )}
    </AnalyticsQuestStyles>
  );
};
