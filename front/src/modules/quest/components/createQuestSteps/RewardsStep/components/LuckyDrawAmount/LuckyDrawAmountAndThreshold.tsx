import { Wrapper } from "@/modules/quest/components/createQuestSteps/RewardsStep/rewardsStep.styles";
import { Box } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { Input } from "@components/UI/input";
import { ChangeEvent, FC } from "react";
import { ILoyaltyProject, QuestStatus } from "@/modules/quest/models";

interface Props {
  luckyDrawUsersAmount: number;
  setLuckyDrawUsersAmount: (v: number) => void;
  threshold: number;
  setThreshold: (v: number) => void;
  currentQuest: ILoyaltyProject;
}

const LuckyDrawAmountAndThreshold: FC<Props> = ({
  luckyDrawUsersAmount,
  setLuckyDrawUsersAmount,
  setThreshold,
  threshold,
  currentQuest,
}) => {
  return (
    <>
      <Wrapper
        maxWidth={664}
        mb={3.5}
        bgcolor={"var(--card, rgba(0, 0, 0, 0.33))"}
      >
        <Box className={"c-full-width c-flex-between"}>
          <p className={"c-font-20-24 c-font-bold"}>
            <Trans id="ediKMLzeM6HdDnsYaK82Gp-quest">Amount of winners</Trans>
          </p>
        </Box>
        <Box my={2.5} borderRadius="10px">
          <Box mt={2}>
            <Box component="p" mb={0.75}>
              Amount
            </Box>
            <Input
              style={{
                minHeight: 52,
              }}
              value={String(luckyDrawUsersAmount)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (
                  isNaN(Number(e.target.value)) ||
                  Number(e.target.value) < 1
                ) {
                  return;
                }
                setLuckyDrawUsersAmount(Number(e.target.value));
              }}
              className="c-full-width"
              clearbtn={false}
              placeholder={t({
                id: "s43Brp7xHzWLP2vvhwf4mk-quest",
                message: "Amount 0f winners",
              })}
              isDisabled={
                Boolean(currentQuest.eligibleUsersCount) ||
                currentQuest.questStatus !== QuestStatus.Draft
              }
            />
          </Box>
          <Box height="1px" width="100%" mt={2} mb={2} />

          <Box mt={2} mb={2} width="100%">
            <Box bgcolor="rgba(255, 255, 255, 0.1)" height="1px" width="100%" />
          </Box>

          <Box component="p" className="c-font-20-24 c-fw-500" mb={1}>
            <Trans id="zxcv4zrANgNTyFfTgMpNWs-quest">
              Amount of prizes is assigned to each winner
            </Trans>
          </Box>
        </Box>
      </Wrapper>
      <Wrapper
        maxWidth={664}
        mb={3.5}
        bgcolor={"var(--card, rgba(0, 0, 0, 0.33))"}
      >
        <Box className={"c-full-width c-flex-between"}>
          <p className={"c-font-20-24 c-font-bold"}>
            <Trans id="lkjsEDLzeM6HdDnsYaK82Mv-quest">
              Threshold of points
            </Trans>
          </p>
        </Box>
        <Box my={2.5} borderRadius="10px">
          <Box mt={2}>
            <Box component="p" mb={0.75}>
              <Trans id="7DQgTzcjfTL8XXBDtE3ftr-quest">Threshold</Trans>
            </Box>
            <Input
              style={{
                minHeight: 52,
              }}
              value={String(threshold)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (
                  isNaN(Number(e.target.value)) ||
                  Number(e.target.value) < 1
                ) {
                  return;
                }
                setThreshold(Number(e.target.value));
              }}
              className="c-full-width"
              clearbtn={false}
              isDisabled={currentQuest.questStatus !== QuestStatus.Draft}
              placeholder={t({
                id: "amALttiXYTDsNDui61qxjg-quest",
                message: "Threshold of points",
              })}
            />
          </Box>
          <Box height="1px" width="100%" mt={2} mb={2} />

          <Box mt={2} mb={2} width="100%">
            <Box bgcolor="rgba(255, 255, 255, 0.1)" height="1px" width="100%" />
          </Box>

          <Box component="p" className="c-font-20-24 c-fw-500" mb={1}>
            <Trans id="qweas2rANgNTyFfTgMpUSA-quest">
              Threshold of points for Lucky Draw
            </Trans>
          </Box>
        </Box>
      </Wrapper>
    </>
  );
};

export default LuckyDrawAmountAndThreshold;
