import {
  EProjectType,
  IQuestShort,
  LoyaltyProjectStatuses,
  PartnerProject,
  RewardToken,
} from "@/modules/quest/models";
import { FC } from "react";
import { Wrapper } from "./trendingItem.styles";
import { Box } from "@mui/material";
import Image from "next/image";
import { DateTime } from "luxon";
import { ProjectInfo } from "@/components/projectInfo";
import { QuestLabelItem } from "@/components/questLabelItem";
import { Trans, t } from "@lingui/macro";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { CountDown } from "@/components/countDown";
import { appConfig } from "@/app.config";
import { useContextSelector } from "use-context-selector";
import { TranslatorContext } from "@/context";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";

interface Props {
  project: IQuestShort;
  index: number;
}

const TrendingItem: FC<Props> = ({ project, index }) => {
  const locale = useContextSelector(TranslatorContext, state => state.language);

  const { push } = useRouter();
  const dispatch = useAppDispatch();

  const onProjectClick = () => {
    dispatch(
      sendAnalyticsDataThunk({
        type: "quest_tap",
        options: {
          event_property_quest_name: project.title,
          event_property_quest_position: index,
        },
      }),
    );

    push(`/quest/${project.linkTitle}`);
  };

  return (
    <Wrapper
      onClick={onProjectClick}
      participated={project.status === LoyaltyProjectStatuses.Participating}
    >
      <Box className="imageWrapper">
        <Image
          src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${project.preview_img}`}
          alt="image"
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>

      <Box className="content" display="flex" flexDirection="column">
        <Box mb={2}>
          <Box className="head" mb={1.5}>
            {project.status && (
              <p className="c-font-12-15 c-font-color c-uppercase">
                {project.status === LoyaltyProjectStatuses.Soon && (
                  <Trans id="hxBQnbuaXh9uETdHWJaRZ5-quest">SOON</Trans>
                )}
                {project.status === LoyaltyProjectStatuses.Expired && (
                  <Trans id="rFMpUTa175X2VRmAfJQoEq-quest">EXPIRED</Trans>
                )}
                {project.status === LoyaltyProjectStatuses.Participating && (
                  <Trans id="vtaCoMiKPCJhgjx6EKU2ov-quest">PARTICIPATING</Trans>
                )}
                {project.status === LoyaltyProjectStatuses.Active && (
                  <Trans id="pcCu1zXJNmMATgSdfnvc9A-quest">ACTIVE</Trans>
                )}
              </p>
            )}

            {project.status === LoyaltyProjectStatuses.Participating && (
              <Box className="statusDivider" />
            )}

            {project.status === LoyaltyProjectStatuses.Participating &&
              project.tasksCount.tasksDone ===
                project.tasksCount.totalTasks && (
                <p className="c-font-12-15 c-font-color-3">
                  <Trans id="tyYgrAdMgrnPHg7cxt3MnF-quest">
                    All tasks done
                  </Trans>
                </p>
              )}

            {project.status === LoyaltyProjectStatuses.Participating &&
              project.tasksCount.tasksDone !==
                project.tasksCount.totalTasks && (
                <p className="c-font-12-15 c-font-color">
                  {project.tasksCount.totalTasks -
                    project.tasksCount.tasksDone ===
                  1
                    ? t({
                        id: "kxStNdec1YkySPX49pJMWp-quest",
                        message: `${
                          project.tasksCount.totalTasks -
                          project.tasksCount.tasksDone
                        } task left`,
                      })
                    : t({
                        id: "nXZHHvkFwvLsNimzfPG35Z-quest",
                        message: `${
                          project.tasksCount.totalTasks -
                          project.tasksCount.tasksDone
                        } tasks left`,
                      })}
                </p>
              )}

            {project.status === LoyaltyProjectStatuses.Participating && (
              <Box className="statusDivider" />
            )}

            {project.status === LoyaltyProjectStatuses.Expired &&
              project.endAt && (
                <p className="c-font-12-15 c-font-color">
                  {DateTime.fromISO(`${project.endAt}`)
                    .toUTC()
                    .toFormat("dd MMM yyyy")}
                </p>
              )}

            {project.status === LoyaltyProjectStatuses.Soon &&
              project.startAt && (
                <p className="c-font-12-15 c-font-color">
                  {DateTime.fromISO(`${project.startAt}`)
                    .toUTC()
                    .toFormat("dd MMM yyyy", { locale })}
                </p>
              )}

            {(project.status === LoyaltyProjectStatuses.Active ||
              project.status === LoyaltyProjectStatuses.Participating) &&
              project.endAt && (
                <CountDown
                  className="c-font-12-15"
                  date={project.endAt}
                  color="#fff"
                />
              )}
          </Box>

          {project.partnerProjects.length > 0 &&
            project.partnerProjects.map((partnerProject: PartnerProject) => (
              <ProjectInfo
                linkTitle={partnerProject.linkTitle}
                key={partnerProject.name}
                title={partnerProject.name}
                subTitle={
                  project.partnerProjects.length === 1 ? project.title : ""
                }
                image={partnerProject.logo}
                approved={partnerProject.verificationIcon}
                imageSize={project.partnerProjects.length > 1 ? "16" : "44"}
                iconSize={project.partnerProjects.length > 1 ? "6" : "16"}
                type="secondary"
              />
            ))}
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          flexGrow={1}
        >
          {(project.partnerProjects.length > 1 ||
            project.partnerProjects.length === 0) &&
            project.title && (
              <Box
                className={"c-font-20-24 c-font-color"}
                mt={{ xs: project.partnerProjects.length > 1 ? 0.5 : 0 }}
                mb={1}
              >
                {project.title}
              </Box>
            )}

          {(project.rewards.whitelisting ||
            project.rewards.tokens.length > 0) && (
            <Box mt="auto">
              {project.projectType === EProjectType.Guaranteed ? (
                <Box
                  display={"inline-flex"}
                  alignItems={"center"}
                  textAlign={"center"}
                  p={"6px 11px 6px 15px"}
                  bgcolor={"rgba(0, 0, 0, 0.56)"}
                  borderRadius="7px"
                  mb={1}
                >
                  <Box
                    component={"p"}
                    className={"c-font-14-20 c-font-color-8"}
                    mr={1}
                  >
                    <Trans id="ryUVueT3Dko1Z9joDw2yri-quest">
                      Guaranteed prizes for everyone
                    </Trans>
                  </Box>
                  <Icon name={"checkmark"} />
                </Box>
              ) : (
                <Box className={"c-font-14-20 c-font-color-8"} mb={1}>
                  <Trans id="rnmiLpriatYeSFoZQ1bnw3-quest">
                    Total campaign prize-pool
                  </Trans>
                </Box>
              )}

              <Box className="items">
                {project.rewards.tokens.length > 0 &&
                  project.rewards.tokens.map((rewardItem: RewardToken, ri) => (
                    <QuestLabelItem
                      key={ri}
                      status={project.status}
                      title={rewardItem.amount}
                      subTitle={rewardItem.symbol}
                      image={rewardItem.logo}
                    />
                  ))}

                {project.rewards.whitelisting && (
                  <QuestLabelItem title={"WL"} status={project.status} />
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {project.totalExp && (
        <Button
          style="primary"
          className="rewardItem c-font-14-14 c-fw-500 exp"
        >
          <>
            <Icon name="star" size="14" style={{ marginRight: "2px" }} />
            <Trans id="fH4RaYsyq2eLosH4SRdZNK-quest">
              {project.totalExp} EXP
            </Trans>
          </>
        </Button>
      )}
    </Wrapper>
  );
};

export default TrendingItem;
