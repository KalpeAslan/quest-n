import { Dispatch, FC, SetStateAction } from "react";
import {
  EProjectType,
  LoyaltyProjectsScoreboard,
  RewardTable,
} from "../../models";
import { Modal } from "@/components/UI/modal";
import { Wrapper } from "./infoPopup.styles";
import { Icon } from "@/components/UI/icon";
import { Button } from "@/components/UI/button";
import { LuckyDrawScoreboard } from "../luckyDrawScoreboard";
import { Scoreboard } from "../scoreboard";
import { RewardsTable } from "../stickyMenu/components/rewardsTable";

interface Props {
  isOpen: "prizePool" | "scoreboard" | null;
  setIsOpen: Dispatch<SetStateAction<"prizePool" | "scoreboard" | null>>;
  rewardsTable?: RewardTable[];
  projectType: EProjectType;
  scores: LoyaltyProjectsScoreboard[];
  isScoresLoaded: boolean;
  setIsShowDetails: Dispatch<SetStateAction<boolean>>;
  getScoresPaginate: (initial?: boolean) => Promise<void>;
  isShowDetails: boolean;
}

const InfoPopup: FC<Props> = ({
  isOpen,
  setIsOpen,
  rewardsTable,
  projectType,
  scores,
  isScoresLoaded,
  setIsShowDetails,
  getScoresPaginate,
  isShowDetails,
}) => {
  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={() => setIsOpen(null)}>
          <Wrapper>
            <Button
              className="c-font-color closeButton"
              style="icon"
              type="button"
              onClick={() => {
                setIsOpen(null);
              }}
              disableTouchStart
            >
              <Icon name="menu-close" size="24" />
            </Button>

            {isOpen === "scoreboard" ? (
              <>
                {projectType === "luckyDraw" ? (
                  <LuckyDrawScoreboard
                    className="scoreboard"
                    scores={scores}
                    isScoresLoaded={isScoresLoaded}
                    isShowDetails={isShowDetails}
                    setIsShowDetails={setIsShowDetails}
                    handleNext={getScoresPaginate}
                    isInfoPopup
                  />
                ) : (
                  <Scoreboard
                    className="scoreboard"
                    scores={scores}
                    isScoresLoaded={isScoresLoaded}
                    isShowDetails={isShowDetails}
                    setIsShowDetails={setIsShowDetails}
                    handleNext={getScoresPaginate}
                    isInfoPopup
                  />
                )}
              </>
            ) : (
              <RewardsTable rewardsTable={rewardsTable} />
            )}
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default InfoPopup;
