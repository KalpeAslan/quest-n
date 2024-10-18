import { Box } from "@mui/material";
import { IProfileQuest } from "@modules/account/models";
import { FC } from "react";
import Icon from "@components/UI/icon/Icon";
import { Trans } from "@lingui/macro";
import ProjectInfo from "@components/projectInfo/ProjectInfo";
import { RewardBadge } from "@components/UI/RewardBadge/RewardBadge";
import { EProjectType, LoyaltyProjectStatuses } from "@modules/quest/models";
import { CountDown } from "@components/countDown";
import { CBreakpoints } from "@styles/variables";
import { useRouter } from "next/router";
import MarqueeWithOverflow from "@components/UI/marqueeWithOverflow/MarqueeWithOverflow";

interface IProps {
  data: IProfileQuest;
}

export const Quest: FC<IProps> = ({ data }) => {
  const renderStatus = () => {
    return (
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        mb={1.5}
      >
        {data.status === LoyaltyProjectStatuses.Expired && (
          <div>
            <span
              style={{ color: "rgba(255, 255, 255, 0.40)" }}
              className="c-font-12-15 c-fw-500 c-uppercase c-letter-spacing-2"
            >
              <Trans id="tUwYtKTUpZaoxAkKNuJsqK-quest">EXPIRED</Trans>
            </span>
            {data.isWinner && (
              <span
                style={{ marginLeft: 5 }}
                className={
                  "c-font-12-15 c-fw-500 c-font-color-3 c-uppercase c-letter-spacing-2"
                }
              >
                <Trans id={"sjdghjwk-wekjvjk"}>WIN</Trans>
                {data.projectType === EProjectType.Scoreboard &&
                  `-#${data.place}`}
              </span>
            )}
          </div>
        )}

        {data.status === LoyaltyProjectStatuses.Win && (
          <div>
            <span
              style={{ color: "rgba(255, 255, 255, 0.40)" }}
              className="c-font-12-15 c-fw-500 c-uppercase c-letter-spacing-2"
            >
              <Trans id="tUwYtKTUpZaoxAkKNuJsqK-quest">EXPIRED</Trans>
            </span>
            {data.isWinner && (
              <span
                style={{ marginLeft: 5 }}
                className={
                  "c-font-12-15 c-fw-500 c-font-color-3 c-uppercase c-letter-spacing-2"
                }
              >
                <Trans id={"sjdghjwk-wekjvjk"}>WIN</Trans>
                {data.projectType === EProjectType.Scoreboard &&
                  `-#${data.place}`}
              </span>
            )}
          </div>
        )}
        {data.status === LoyaltyProjectStatuses.Participating && (
          <div>
            <p className="c-font-12-15 c-fw-500 c-font-color-3 c-uppercase c-letter-spacing-2">
              <Trans id="bqXHebW4XqLRee9KLgznRB-quest">PARTICIPATING</Trans>
            </p>
            {data.endAt && (
              <CountDown
                className="c-font-12-15 c-font-color-3"
                date={data.endAt}
                color="#fff"
              />
            )}
          </div>
        )}
        {data.status === LoyaltyProjectStatuses.Active && (
          <div>
            <p className="c-font-12-15 c-fw-500 c-font-color-3 c-uppercase c-letter-spacing-2">
              <Trans id="xhbaSzxBRoQVapGZSysGds-quest">Participating</Trans>
            </p>
            {data.endAt && (
              <CountDown
                className="c-font-12-15"
                date={data.endAt}
                color="#fff"
              />
            )}
          </div>
        )}
      </Box>
    );
  };

  const renderProjectType = () => {
    switch (data.projectType) {
      case EProjectType.Guaranteed:
        return (
          <>
            <Box>
              <Icon name={"scoreboardProfile"} size={"14"} />
            </Box>
            <span className={"c-fw-400 c-font-color c-font-12-14"}>
              <Trans id={"sxxdlkvh-34heruvu-23rfj"}>Guaranteed</Trans>
            </span>
          </>
        );
      case EProjectType.LuckyDraw:
        return (
          <>
            <Box>
              <Icon name={"luckyDrawProfile"} size={"14"} />
            </Box>
            <span className={"c-fw-400 c-font-color c-font-12-14"}>
              <Trans id={"sdjvnjkh43-21oryron-dzv"}>Lucky Draw</Trans>
            </span>
          </>
        );
      case EProjectType.Scoreboard:
        return (
          <>
            <Box>
              <Icon name={"scoreboardProfile"} size={"14"} />
            </Box>
            <span className={"c-fw-400 c-font-color c-font-12-14"}>
              <Trans id={"sdlkvh-34heruvu-23rfj"}>Scoreboard</Trans>
            </span>
          </>
        );
    }
  };

  const { push } = useRouter();

  return (
    <Box
      className={"c-pointer"}
      onClick={() => push(`/quest/${data.linkTitle}`)}
      borderRadius={4}
      border={"0.5px solid rgba(255, 255, 255, 0.10)"}
      bgcolor={"var(--color-b25)"}
      minHeight={180}
      p={2}
      display={"flex"}
      alignItems={"start"}
      flexDirection={"column"}
      sx={theme => ({
        width: 309,
        [theme.breakpoints.down(CBreakpoints.md)]: {
          width: 350,
        },
        [theme.breakpoints.down(CBreakpoints.sm)]: {
          width: "100%",
        },
        ".rewardItem": {
          padding: "5px 7px",
          borderRadius: "6px",
          pointerEvents: "none",
          width: "fit-content",
          marginRight: 1,
        },
      })}
    >
      <Box
        className={"quest__header"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        width={"100%"}
      >
        <Box
          bgcolor={"rgba(50, 49, 49, 0.60)"}
          borderRadius={2}
          px={"10px"}
          height={28}
          style={{ backdropFilter: "blur(5px)" }}
          className={"quest__badge"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"5px"}
        >
          {renderProjectType()}
        </Box>
        {renderStatus()}
      </Box>

      <Box className={"quest__body"}>
        <Box mt={2} mb={4}>
          <ProjectInfo
            linkTitle={data.linkTitle}
            title={data.projectName}
            approved={true}
            type={"secondary"}
            image={data.preview_img}
            slider={false}
            imageSize={"44"}
            subTitle={data.title}
            maxWidth={200}
          />
        </Box>
      </Box>
      <Box className={"quest__footer"}>
        <p className={"c-font-14-14 c-font-color c-fw-400"}>
          <Trans id={"vfdkvh-34heruvu-23rfj"}>Total campaign prize-pool</Trans>
        </p>
        <Box
          sx={theme => ({
            mt: 1,
            width: 309 - 40,
            [theme.breakpoints.down(CBreakpoints.md)]: {
              width: 350 - 40,
            },
          })}
        >
          <MarqueeWithOverflow autoFill pauseOnHover speed={40}>
            {data.rewards &&
              data.rewards.map((reward, index) => (
                <Box key={index}>
                  <RewardBadge
                    className={"rewardItem"}
                    symbol={reward.contract.symbol}
                    type={reward.contract.type}
                    amount={
                      Number.isInteger(+reward.amount)
                        ? reward.amount
                        : Number(reward.amount).toFixed(2)
                    }
                  />
                </Box>
              ))}
          </MarqueeWithOverflow>
        </Box>
      </Box>
    </Box>
  );
};
