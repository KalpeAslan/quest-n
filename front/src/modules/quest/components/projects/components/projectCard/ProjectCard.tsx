import { forwardRef, ForwardRefRenderFunction, memo, useMemo } from "react";
import { Box } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import { DateTime } from "luxon";
import { ProjectInfo } from "@components/projectInfo";
import { CountDown } from "@components/countDown";
import {
  EProjectType,
  EReward,
  IQuestShort,
  LoyaltyProjectStatuses,
  PartnerProject,
} from "@modules/quest/models";
import { Wrapper } from "./projectCard.styles";
import classnames from "classnames";
import { useContextSelector } from "use-context-selector";
import { TranslatorContext } from "@/context";
import { Button } from "@/components/UI/button";
import Icon from "@components/UI/icon/Icon";
import { MarqueeWithOverflow } from "@/components/UI/marqueeWithOverflow";
import Image from "next/image";
import {
  guaranteedImg,
  luckyDrawImg,
  scoreboardImg,
} from "@/modules/quest/assets";
import { RewardBadge } from "@components/UI/RewardBadge/RewardBadge";

type ProjectCardProps = {
  data: IQuestShort;
  onClick: () => void;
  index?: number;
};

const ProjectCard: ForwardRefRenderFunction<
  HTMLDivElement,
  ProjectCardProps
> = ({ data, onClick, index }, ref) => {
  const locale = useContextSelector(TranslatorContext, state => state.language);

  const projectInfo = useMemo(() => {
    return (
      data.partnerProjects.length > 0 &&
      data.partnerProjects.map((partnerProject: PartnerProject) => (
        <ProjectInfo
          linkTitle={partnerProject.linkTitle}
          key={partnerProject.name}
          title={partnerProject.name}
          subTitle={data.partnerProjects.length === 1 ? data.title : ""}
          image={partnerProject.logo}
          approved={partnerProject.verificationIcon}
          imageSize={data.partnerProjects.length > 1 ? "16" : "44"}
          iconSize={data.partnerProjects.length > 1 ? "6" : "16"}
          type="secondary"
        />
      ))
    );
  }, [data.partnerProjects]);

  return (
    <Wrapper
      index={index + 1}
      onClick={onClick}
      className={classnames({
        participated:
          data.status === LoyaltyProjectStatuses.Participating.toLowerCase(),
        expired: data.status === LoyaltyProjectStatuses.Expired.toLowerCase(),
      })}
      id={`quest-${data.linkTitle}__${index + 1}`}
      ref={ref}
    >
      <div className="content">
        <Box>
          <Box className="head" mb={1.5}>
            {data.status && (
              <p className="c-font-12-15 c-font-color c-uppercase">
                {data.status === LoyaltyProjectStatuses.Soon && (
                  <Trans id="h9L83gvwZZm6VkqxLK3vLe-quest">SOON</Trans>
                )}
                {data.status === LoyaltyProjectStatuses.Expired && (
                  <Trans id="tUwYtKTUpZaoxAkKNuJsqK-quest">EXPIRED</Trans>
                )}
                {data.status === LoyaltyProjectStatuses.Participating && (
                  <Trans id="bqXHebW4XqLRee9KLgznRB-quest">PARTICIPATING</Trans>
                )}
                {data.status === LoyaltyProjectStatuses.Active && (
                  <Trans id="7hbaSzxBRoQVapGZSysGds-quest">ACTIVE</Trans>
                )}
              </p>
            )}

            {data.status === LoyaltyProjectStatuses.Participating && (
              <Box className="statusDivider" />
            )}

            {data.status === LoyaltyProjectStatuses.Participating &&
              data.tasksCount.tasksDone === data.tasksCount.totalTasks && (
                <p className="c-font-12-15 c-font-color-3">
                  <Trans id="7yjgtB3fooURpxzbwFsENe-quest">
                    All tasks done
                  </Trans>
                </p>
              )}

            {data.status === LoyaltyProjectStatuses.Participating &&
              data.tasksCount.tasksDone !== data.tasksCount.totalTasks && (
                <p className="c-font-12-15 c-font-color">
                  {data.tasksCount.totalTasks - data.tasksCount.tasksDone === 1
                    ? t({
                        id: "fB2sUSoUnR4qf9K2wAQgMo-quest",
                        message: `${
                          data.tasksCount.totalTasks - data.tasksCount.tasksDone
                        } task left`,
                      })
                    : t({
                        id: "nVhmFLyZvUztdL9PqBYL5W-quest",
                        message: `${
                          data.tasksCount.totalTasks - data.tasksCount.tasksDone
                        } tasks left`,
                      })}
                </p>
              )}

            {data.status === LoyaltyProjectStatuses.Participating && (
              <Box className="statusDivider" />
            )}

            {data.status === LoyaltyProjectStatuses.Expired && data.endAt && (
              <p className="c-font-12-15 c-font-color">
                {DateTime.fromISO(`${data.endAt}`)
                  .toUTC()
                  .toFormat("dd MMM yyyy")}
              </p>
            )}
            {data.status === LoyaltyProjectStatuses.Soon && data.startAt && (
              <p className="c-font-12-15 c-font-color">
                {DateTime.fromISO(`${data.startAt}`)
                  .toUTC()
                  .toFormat("dd MMM yyyy", { locale })}
              </p>
            )}

            {(data.status === LoyaltyProjectStatuses.Active ||
              data.status === LoyaltyProjectStatuses.Participating) &&
              data.endAt && (
                <CountDown
                  className="c-font-12-15"
                  date={data.endAt}
                  color="#fff"
                />
              )}

            {data.status !== LoyaltyProjectStatuses.Participating && (
              <Box className="c-font-color typeLabel">
                <Image
                  src={
                    data.projectType === EProjectType.Scoreboard
                      ? scoreboardImg
                      : data.projectType === EProjectType.LuckyDraw
                      ? luckyDrawImg
                      : guaranteedImg
                  }
                  alt={
                    data.projectType === EProjectType.Scoreboard
                      ? "Scoreboard"
                      : data.projectType === EProjectType.LuckyDraw
                      ? "Lucky draw"
                      : "Guaranteed"
                  }
                  className="typeLabelImage"
                  width={13}
                  height={13}
                />
                <Box className="c-font-12-14" ml="5px">
                  {data.projectType === EProjectType.Scoreboard
                    ? "Scoreboard"
                    : data.projectType === EProjectType.LuckyDraw
                    ? "Lucky draw"
                    : "Guaranteed"}
                </Box>
              </Box>
            )}
          </Box>

          {projectInfo}
        </Box>

        {(data.partnerProjects.length > 1 ||
          data.partnerProjects.length === 0) &&
          data.title && (
            <Box
              className={"c-font-20-24 c-font-color"}
              mt={{ xs: data.partnerProjects.length > 1 ? 0.5 : 0 }}
              mb={1}
            >
              {data.title}
            </Box>
          )}

        {(data.rewards.whitelisting || data.rewards.tokens.length > 0) && (
          <Box mt="auto">
            {data.projectType === EProjectType.Guaranteed ? (
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
                  <Trans id="acc2d606-208a-11ee-be56-0242ac120002">
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

            <MarqueeWithOverflow autoFill pauseOnHover speed={40}>
              {data.rewards.tokens
                .sort((a, b) => Number(b.amount) - Number(a.amount))
                .map((item, index) => (
                  <div className="rewardItemWrapper" key={item.id}>
                    <RewardBadge
                      className={"rewardItem"}
                      buttonStyle={
                        index === 0 &&
                        item.type !== EReward.AQ &&
                        item.symbol.toLowerCase() !== "aq"
                          ? "primary"
                          : "colorfull"
                      }
                      symbol={item.symbol}
                      key={index}
                      amount={item.amount}
                      type={item.type}
                    />
                  </div>
                ))}
              {data.rewards.whitelisting && (
                <Button
                  style="colorfull"
                  className="rewardItem c-font-14-14 c-fw-500"
                >
                  White List
                </Button>
              )}
              {data.totalExp && (
                <Button
                  style="primary"
                  className="rewardItem c-font-14-14 c-fw-500 exp"
                >
                  <>
                    <Icon
                      name="star"
                      size="14"
                      style={{ marginRight: "2px" }}
                    />
                    <Trans id="uFcJ7QmwQp1XmVJiFCZ3nU-quest">
                      {data.totalExp} EXP
                    </Trans>
                  </>
                </Button>
              )}
            </MarqueeWithOverflow>
          </Box>
        )}
      </div>
    </Wrapper>
  );
};

export default memo(forwardRef(ProjectCard));
