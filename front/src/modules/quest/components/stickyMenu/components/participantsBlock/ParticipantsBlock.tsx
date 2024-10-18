import { Box } from "@mui/material";
import { Wrapper } from "./participantsBlock.styles";
import { Tooltip } from "@/components/UI/tooltip";
import Image from "next/image";
import { participantsImg } from "@/modules/quest/assets";
import { EProjectType, LoyaltyProjectStatuses } from "@/modules/quest/models";
import { Dispatch, FC, SetStateAction } from "react";
import { Trans, t } from "@lingui/macro";

interface Props {
  projectType: EProjectType;
  totalParticipants: number;
  scoreboardOpen: boolean;
  setScoreboardOpen: Dispatch<SetStateAction<boolean>>;
  eligibleParticipants?: number;
  projectStatus: LoyaltyProjectStatuses;
}

const ParticipantsBlock: FC<Props> = ({
  projectType,
  totalParticipants,
  eligibleParticipants,
  setScoreboardOpen,
  scoreboardOpen,
  projectStatus,
}) => {
  return (
    <Wrapper scoreboardOpen={scoreboardOpen}>
      <Box>
        <Box className="participantsContainer c-font-color">
          {projectType === EProjectType.LuckyDraw
            ? eligibleParticipants
            : totalParticipants}{" "}
          Participants
          {projectType === EProjectType.LuckyDraw && (
            <Tooltip
              value={
                <Trans id="4ajskY6QMFdekvJc3Q8hWZ-quest">
                  Eligible Participants: {eligibleParticipants}
                  <br />
                  Total Participants: {totalParticipants}
                </Trans>
              }
            >
              <Box className="tooltip c-font-color c-font-10-20">?</Box>
            </Tooltip>
          )}
        </Box>

        {projectType === EProjectType.Scoreboard && (
          <Box
            onClick={() => setScoreboardOpen(prev => !prev)}
            component="button"
            className="c-font-color-3 c-font-16-20 c-fw-500 scoreboardButton"
            mt="5px"
          >
            {scoreboardOpen
              ? t({
                  id: "kiKt99wTnZCySKUKat5vLW-quest",
                  message: "Hide Scoreboard",
                })
              : t({
                  id: "t6isFYwYKJGf3wRy3YbPnr-quest",
                  message: "View Scoreboard",
                })}
          </Box>
        )}

        {projectType === EProjectType.LuckyDraw &&
          (projectStatus === LoyaltyProjectStatuses.Expired ||
            projectStatus === LoyaltyProjectStatuses.Win) && (
            <Box
              onClick={() => setScoreboardOpen(prev => !prev)}
              component="button"
              className="c-font-color-3 c-font-16-20 c-fw-500 scoreboardButton"
              mt="5px"
            >
              {scoreboardOpen
                ? t({
                    id: "mYdGEc4jgsBorA8ttcQY6k-quest",
                    message: "Hide Winners list",
                  })
                : t({
                    id: "kPicvPefSEA2hG7acpKdtK-quest",
                    message: "Show winners list",
                  })}
            </Box>
          )}
      </Box>

      <Box>
        <Image
          src={participantsImg}
          alt={t({
            id: "gcVtrkRrcqMhJ3m5Ja19dV-quest",
            message: "Participants",
          })}
          width={160}
          height={35}
        />
      </Box>
    </Wrapper>
  );
};

export default ParticipantsBlock;
