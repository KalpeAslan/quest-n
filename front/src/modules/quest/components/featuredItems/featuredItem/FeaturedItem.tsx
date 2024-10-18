import { Box } from "@mui/material";
import { Wrapper } from "./featuredItem.styles";
import Image from "next/image";

import { CountDown } from "@/components/countDown";
import { ProjectInfo } from "@/components/projectInfo";
import { t, Trans } from "@lingui/macro";
import {
  EProjectType,
  EReward,
  IQuestShort,
  LoyaltyProjectStatuses,
  PartnerProject,
  QuestStatus,
  RewardToken
} from "@/modules/quest/models";
import { QuestLabelItem } from "@/components/questLabelItem";
import { FC } from "react";
import { DateTime } from "luxon";
import { appConfig } from "@/app.config";
import { useContextSelector } from "use-context-selector";
import { TranslatorContext } from "@/context";
import { Icon } from "@/components/UI/icon";
import { Button } from "@/components/UI/button";
import { RewardBadge } from "@components/UI/RewardBadge/RewardBadge";
import { MarqueeWithOverflow } from "@/components/UI/marqueeWithOverflow";

interface Props {
  project: IQuestShort;
  onClick?: () => void;
  className?: string;
  admin?: boolean;
  handleDelete?: () => void;
  handlePreview?: () => void;
  handleEdit?: () => void;
  handleAnalytics?: () => void;
}

const FeaturedItem: FC<Props> = ({
  project,
  onClick,
  className,
  admin,
  handleDelete,
  handlePreview,
  handleEdit,
  handleAnalytics,
}) => {
  const locale = useContextSelector(TranslatorContext, state => state.language);

  const renderHeader = () => {
    if (admin) {
      return (
        <Box>
          {project.status && (
            <p className="c-font-12-15 c-font-color c-uppercase">
              {project.questStatus === QuestStatus.Draft && (
                <Trans id="xUYVTsfm1Kd2Gh8M6Jq9Mc-quest">Draft</Trans>
              )}
              {project.questStatus === QuestStatus.Active && (
                <Trans id="upQbc6G2xjdQeDbpQeR21h-quest">ACTIVE</Trans>
              )}
              {project.questStatus === QuestStatus.Completed && (
                <Trans id="xpQbc6G2xjdQeDbpQeR21h-quest">Completed</Trans>
              )}
            </p>
          )}
        </Box>
      );
    }
    return (
      <>
        {project.status && (
          <p className="c-font-12-15 c-font-color c-uppercase">
            {project.status === LoyaltyProjectStatuses.Soon && (
              <Trans id="aUYVTsfm1Kd2Gh8M6Jq9Mc-quest">SOON</Trans>
            )}
            {project.status === LoyaltyProjectStatuses.Expired && (
              <Trans id="f9DqQ52W8cEu3AHhg87421-quest">EXPIRED</Trans>
            )}
            {project.status === LoyaltyProjectStatuses.Participating && (
              <Trans id="5JMWmN1fLWPScCoPLzDAHR-quest">PARTICIPATING</Trans>
            )}
            {project.status === LoyaltyProjectStatuses.Active && (
              <Trans id="upQbc6G2xjdQeDbpQeR21h-quest">ACTIVE</Trans>
            )}
          </p>
        )}

        {project.status === LoyaltyProjectStatuses.Participating && (
          <Box className="statusDivider" />
        )}

        {project.status === LoyaltyProjectStatuses.Participating &&
          project.tasksCount.tasksDone === project.tasksCount.totalTasks && (
            <p className="c-font-12-15 c-font-color-3">
              <Trans id="wG3aHdxC5y6p1gxkuaNdyi-quest">All tasks done</Trans>
            </p>
          )}

        {project.status === LoyaltyProjectStatuses.Participating &&
          project.tasksCount.tasksDone !== project.tasksCount.totalTasks && (
            <p className="c-font-12-15 c-font-color">
              {project.tasksCount.totalTasks - project.tasksCount.tasksDone ===
              1
                ? t({
                    id: "eWb45jbtqjfH9r4FLWcGjV-quest",
                    message: `${
                      project.tasksCount.totalTasks -
                      project.tasksCount.tasksDone
                    } task left`,
                  })
                : t({
                    id: "gWq2WkZJeJrXG82AEUAbLC-quest",
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

        {project.status === LoyaltyProjectStatuses.Expired && project.endAt && (
          <p className="c-font-12-15 c-font-color">
            {DateTime.fromISO(`${project.endAt}`)
              .toUTC()
              .toFormat("dd MMM yyyy")}
          </p>
        )}

        {project.status === LoyaltyProjectStatuses.Soon && project.startAt && (
          <p className="c-font-12-15 c-font-color">
            {DateTime.fromISO(`${project.startAt}`)
              .toUTC()
              .toFormat("dd MMM yyyy", { locale })}
          </p>
        )}
      </>
    );
  };

  const renderRewards = () => {
    if (admin) {
      return (
        <MarqueeWithOverflow autoFill pauseOnHover speed={40}>
          {project.rewards.tokens.length > 0 &&
            project.rewards.tokens
              .sort((a, b) => Number(b.amount) - Number(a.amount))
              .map((rewardItem: RewardToken, idx) => (
                <div className="rewardItemWrapper" key={idx}>
                  <RewardBadge
                    className={"rewardItem"}
                    buttonStyle={
                      idx === 0 &&
                      rewardItem.type !== EReward.AQ &&
                      rewardItem.symbol.toLowerCase() !== "aq"
                        ? "primary"
                        : "colorfull"
                    }
                    symbol={rewardItem.symbol}
                    key={idx}
                    amount={rewardItem.amount}
                    type={rewardItem.type}
                  />
                </div>
              ))}
          {project.rewards.whitelisting && (
            <RewardBadge type={EReward.WHITELIST} amount={""} />
          )}
        </MarqueeWithOverflow>
      );
    }
    return (
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
    );
  };

  return (
    <Wrapper
      participated={project.status === LoyaltyProjectStatuses.Participating}
      soon={true}
      className={className}
      onClick={e => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {admin && project.questStatus !== QuestStatus.Draft && (
        <Box
          position={"absolute"}
          className={"analytics-button"}
          top={20}
          left={20}
          zIndex={999}
        >
          <Button
            size={"extraSmall"}
            style="colorfull"
            onClick={handleAnalytics}
          >
            <Box>
              <Icon name="analytics" className="btnIcon" />
              <p className={"c-font-14-16 c-fw-500"}>View Stats</p>
            </Box>
          </Button>
        </Box>
      )}
      {admin && (
        <Box className="adminLabel c-font-color c-font-12-14 c-fw-400">
          {project.projectType === EProjectType.Scoreboard &&
            t({ id: "bq9dUBx3UaTQvWiY9vpCGA-quest", message: "Scoreboard" })}
          {project.projectType === EProjectType.LuckyDraw &&
            t({ id: "n8d61XSGRJHaNyjmq9dRbn-quest", message: "Lucky Draw" })}
          {project.projectType === EProjectType.Guaranteed &&
            t({ id: "azyS3k74KnmSnCzMSLqdf9-quest", message: "Guaranteed" })}
        </Box>
      )}

      <Box position="relative" height="224px" width="100%">
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
            {renderHeader()}
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
                key={partnerProject.name}
                title={partnerProject.name}
                subTitle={
                  project.partnerProjects.length === 1 ? project.title : ""
                }
                linkTitle={partnerProject.linkTitle}
                image={partnerProject.logo}
                approved={partnerProject.verificationIcon}
                imageSize={project.partnerProjects.length > 1 ? "16" : "44"}
                iconSize={project.partnerProjects.length > 1 ? "6" : "16"}
                type="secondary"
                slider
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
                    <Trans id="jVSgis7am74e3RM1L4cuWg-quest">
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

              {renderRewards()}
            </Box>
          )}
        </Box>

        {admin && (
          <Box
            display="flex"
            justifyContent="space-between"
            mt={2}
            flexWrap={"wrap"}
            gap={2}
          >
            <Button
              style="error"
              className="btn c-font-14-16 c-fw-500"
              onClick={handleDelete}
            >
              <>
                <Icon name="menu-close" className="btnIcon" />
                <Trans id="rppbdYx4M833t3TST7L8T6-quest">Delete</Trans>
              </>
            </Button>

            <Button
              style="secondary"
              className="btn c-font-14-16 c-fw-500"
              onClick={handlePreview}
            >
              <>
                <Icon name="show" className="btnIcon" />
                <Trans id="bZaGrvEpBk6DwiqKEB1EHx-quest">Preview</Trans>
              </>
            </Button>

            <Button
              style="secondary"
              className="btn c-font-14-16 c-fw-500"
              onClick={handleEdit}
            >
              <>
                <Icon name="menu-settings" className="btnIcon" />
                <Trans id="g3KZhwK2MHhdMpAdz6Ti74-quest">Edit</Trans>
              </>
            </Button>
          </Box>
        )}
      </Box>

      {!admin && project.totalExp && (
        <Button
          style="primary"
          className="rewardItem c-font-14-14 c-fw-500 exp"
        >
          <>
            <Icon name="star" size="14" style={{ marginRight: "2px" }} />
            <Trans id="qApBfomko8PcVymWSH5yBE-quest">
              {project.totalExp} EXP
            </Trans>
          </>
        </Button>
      )}
    </Wrapper>
  );
};

export default FeaturedItem;
