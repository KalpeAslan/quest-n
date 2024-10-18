import { Box } from "@mui/material";
import { Wrapper } from "./featuredItem.styles";
import Image from "next/image";
import { appConfig } from "@/app.config";
import { DateTime } from "luxon";
import {
  EProjectType,
  EReward,
  IQuestShort,
  LoyaltyProjectStatuses,
} from "../../models";
import { guaranteedImg, luckyDrawImg, scoreboardImg } from "../../assets";
import { MarqueeWithOverflow } from "@/components/UI/marqueeWithOverflow";
import { FC, useState } from "react";
import { useContextSelector } from "use-context-selector";
import { TranslatorContext } from "@/context";
import { Icon } from "@/components/UI/icon";
import { CountDown } from "@/components/countDown";
import classNames from "classnames";
import { Button } from "@/components/UI/button";
import { useRouter } from "next/router";
import { RewardBadge } from "@components/UI/RewardBadge/RewardBadge";
import { Trans, t } from "@lingui/macro";

interface Props {
  quest: IQuestShort;
  className?: string;
}

const FeaturedItem: FC<Props> = ({ quest, className }) => {
  const [partnersOverflow, setPartnersOverflow] = useState<boolean>(false);

  const { push } = useRouter();

  const locale = useContextSelector(TranslatorContext, state => state.language);

  return (
    <Wrapper
      href={`quest/${quest.linkTitle}`}
      className={classNames("c-font-color", className)}
    >
      {/* <Box className="backgroundImage">
        <Image
          src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${quest.preview_img}`}
          alt={quest.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Box className="backgroundFilter" /> */}

      <Box
        zIndex={3}
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
      >
        <Box className="imageContainer">
          <Box className="imageWrapper">
            <Image
              alt={quest.title}
              src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${quest.preview_img}`}
              fill
              className="image"
            />

            <Box className="partnersContainer">
              {quest.partnerProjects.length === 1 && (
                <Box className="mainPartnerProjectContainer">
                  <Box
                    className="mainPartnerProjectImageWrapper"
                    sx={{ cursor: "pointer" }}
                    onClick={e => {
                      e.preventDefault();
                      push(`partners/${quest.partnerProjects[0].linkTitle}`);
                    }}
                  >
                    <Box className="mainPartnerProjectImageContainer">
                      <Image
                        src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${quest.partnerProjects[0].logo}`}
                        width={44}
                        height={44}
                        alt={quest.partnerProjects[0].name}
                      />
                    </Box>
                    <Icon
                      className="icon"
                      name="quest-check-mark"
                      size="12"
                      style={{
                        position: "absolute",
                        bottom: "-5px",
                        right: "-5px",
                      }}
                    />
                  </Box>

                  <Box>
                    <Box
                      className="c-font-11-17"
                      sx={{ cursor: "pointer" }}
                      onClick={e => {
                        e.preventDefault();
                        push(`partners/${quest.partnerProjects[0].linkTitle}`);
                      }}
                    >
                      {quest.partnerProjects[0].name}
                    </Box>
                    <Box className="c-font-14-20 c-fw-500">{quest.title}</Box>
                  </Box>
                </Box>
              )}

              {quest.partnerProjects.length > 1 && (
                <>
                  <MarqueeWithOverflow
                    autoFill
                    pauseOnHover
                    speed={25}
                    callback={setPartnersOverflow}
                  >
                    {quest.partnerProjects.map(
                      (partnerProjectItem, index, array) => (
                        <Box
                          key={partnerProjectItem.linkTitle}
                          className="partnerProjectItemWrapper"
                          sx={{ cursor: "pointer" }}
                          onClick={e => {
                            e.preventDefault();
                            push(`partners/${partnerProjectItem.linkTitle}`);
                          }}
                        >
                          <Box className="partnerProjectItemContainer">
                            <Box className="partnerProjectImageWrapper">
                              <Box className="partnerProjectImageContainer">
                                <Image
                                  src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${partnerProjectItem.logo}`}
                                  width={20}
                                  height={20}
                                  alt={quest.partnerProjects[0].name}
                                />
                              </Box>
                              <Icon
                                className="icon"
                                name="quest-check-mark"
                                size="7"
                                style={{
                                  position: "absolute",
                                  bottom: 0,
                                  right: 0,
                                }}
                              />
                            </Box>

                            <Box
                              className="c-font-11-17"
                              sx={{ textWrap: "nowrap" }}
                            >
                              {partnerProjectItem.name}
                            </Box>
                          </Box>

                          {(partnersOverflow || index !== array.length - 1) && (
                            <Box className="divider" />
                          )}
                        </Box>
                      ),
                    )}
                  </MarqueeWithOverflow>

                  <Box className="c-font-14-20 c-fw-500" mt="5px">
                    {quest.title}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>

        <Box className="content">
          <Box className="head">
            <Box
              className={classNames("c-font-12-15 c-fw-500 c-uppercase", {
                "c-font-color-3":
                  quest.status === LoyaltyProjectStatuses.Active,
              })}
            >
              {quest.status}
            </Box>

            {quest.status === LoyaltyProjectStatuses.Participating && (
              <Box className="statusDivider" />
            )}

            {quest.status === LoyaltyProjectStatuses.Participating &&
              quest.tasksCount.tasksDone === quest.tasksCount.totalTasks && (
                <p className="c-font-12-15 c-font-color-3">
                  <Trans id="6U37KX7AGxR8nRvjLwgzz2-quest">
                    All tasks done
                  </Trans>
                </p>
              )}

            {quest.status === LoyaltyProjectStatuses.Participating &&
              quest.tasksCount.tasksDone !== quest.tasksCount.totalTasks && (
                <p className="c-font-12-15 c-font-color">
                  {quest.tasksCount.totalTasks - quest.tasksCount.tasksDone ===
                  1
                    ? t({
                        id: "axy8PvBmrwjduWdSzgJsue-quest",
                        message: `${
                          quest.tasksCount.totalTasks -
                          quest.tasksCount.tasksDone
                        } task left`,
                      })
                    : t({
                        id: "8WhdWQseTvzF5rAAeaLDKj-quest",
                        message: `${
                          quest.tasksCount.totalTasks -
                          quest.tasksCount.tasksDone
                        } tasks left`,
                      })}
                </p>
              )}

            {quest.status === LoyaltyProjectStatuses.Participating && (
              <Box className="statusDivider" />
            )}

            {quest.status === LoyaltyProjectStatuses.Expired && quest.endAt && (
              <p className="c-font-12-15 c-font-color">
                {DateTime.fromISO(`${quest.endAt}`)
                  .toUTC()
                  .toFormat("dd MMM yyyy")}
              </p>
            )}

            {quest.status === LoyaltyProjectStatuses.Soon && quest.startAt && (
              <p className="c-font-12-15 c-font-color">
                {DateTime.fromISO(`${quest.startAt}`)
                  .toUTC()
                  .toFormat("dd MMM yyyy", { locale })}
              </p>
            )}

            {(quest.status === LoyaltyProjectStatuses.Active ||
              quest.status === LoyaltyProjectStatuses.Participating) &&
              quest.endAt && (
                <CountDown
                  className="c-font-12-15"
                  date={quest.endAt}
                  color="#fff"
                />
              )}
          </Box>

          <Box className="prizePoolContainer">
            <Box className="c-font-14-20 prizePoolTitle">
              <Trans id="mPBnafEakGc4U7QKyT7egz-quest">
                Total campaign prize-pool
              </Trans>
            </Box>

            <MarqueeWithOverflow autoFill pauseOnHover speed={40}>
              {quest.rewards.tokens
                .sort((a, b) => Number(b.amount) - Number(a.amount))
                .map((item, index) => (
                  <div className={"rewardItemWrapper"} key={index}>
                    <RewardBadge
                      className={"rewardItem"}
                      amount={item.amount}
                      type={item.type}
                      symbol={item.symbol}
                      buttonStyle={
                        index === 0 &&
                        item.type !== EReward.AQ &&
                        item.symbol.toLowerCase() !== "aq"
                          ? "primary"
                          : "colorfull"
                      }
                    />
                  </div>
                ))}
              {quest.rewards.whitelisting && (
                <Button
                  style="colorfull"
                  className="rewardItem c-font-14-14 c-fw-500"
                >
                  <Trans id="qKywFfBjNAMsT9tkiGhrva-quest">White List</Trans>
                </Button>
              )}
            </MarqueeWithOverflow>
          </Box>
        </Box>

        <Box className="typeLabel">
          <Image
            src={
              quest.projectType === EProjectType.Scoreboard
                ? scoreboardImg
                : quest.projectType === EProjectType.LuckyDraw
                ? luckyDrawImg
                : guaranteedImg
            }
            alt={
              quest.projectType === EProjectType.Scoreboard
                ? t({
                    id: "2xmWp14ZD2274u5anQAx8K-quest",
                    message: "Scoreboard",
                  })
                : quest.projectType === EProjectType.LuckyDraw
                ? t({
                    id: "kAQbfVyKH6UMEYW4ckamjR-quest",
                    message: "Lucky draw",
                  })
                : t({
                    id: "2SqjEVz74s83BkcsMdgyYu-quest",
                    message: "Guaranteed",
                  })
            }
            className="typeLabelImage"
            width={13}
            height={13}
          />
          <Box className="c-font-12-14" ml="5px">
            {quest.projectType === EProjectType.Scoreboard
              ? t({ id: "oV5g6NNMc33nc4QWjAW7Gs-quest", message: "Scoreboard" })
              : quest.projectType === EProjectType.LuckyDraw
              ? t({ id: "1UpcSWbsJrF2eJYaZ2ZeYY-quest", message: "Lucky draw" })
              : t({
                  id: "2h5yZsbYsmNXNw9qAeURS2-quest",
                  message: "Guaranteed",
                })}
          </Box>
        </Box>
      </Box>

      {quest.totalExp && (
        <Button
          style="primary"
          className="rewardItem c-font-14-14 c-fw-500 exp"
        >
          <>
            <Icon name="star" size="14" style={{ marginRight: "2px" }} />
            <Trans id="8HjvRGdCBw15EBwnJ9uMzj-quest">
              {quest.totalExp} EXP
            </Trans>
          </>
        </Button>
      )}
    </Wrapper>
  );
};

export default FeaturedItem;
