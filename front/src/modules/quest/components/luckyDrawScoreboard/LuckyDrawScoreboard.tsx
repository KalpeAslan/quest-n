import { FC } from "react";
import { Box } from "@mui/material";
import classnames from "classnames";
import { t, Trans } from "@lingui/macro";
import { ITableColumn } from "@models";
import { LoyaltyProjectsScoreboard } from "@modules/quest/models";
import { Table } from "@components/UI/table";
import { Icon } from "@components/UI/icon";
import { Loader } from "@components/UI/loader";
import { ShowMore } from "@components/UI/showMore";

import {
  LuckyDrawScoreboardStylesEmptyScoreBoard,
  TableDecor,
  TableWrapper,
} from "./lcukyDrawScoreboard.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";

interface LuckyDrawScoreboardItem extends LoyaltyProjectsScoreboard {
  selected?: boolean;
}

type ScoreboardProps = {
  className?: string;
  scores: LuckyDrawScoreboardItem[];
  isScoresLoaded: boolean;
  isShowDetails: boolean;
  setIsShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  isInfoPopup?: boolean;
  handleNext: () => any;
  moreLoading?: boolean;
};

const LuckyDrawScoreboard: FC<ScoreboardProps> = ({
  className,
  scores,
  isScoresLoaded,
  isShowDetails,
  setIsShowDetails,
  isInfoPopup,
  handleNext,
  moreLoading,
}) => {
  const accountInfo = useTypedSelector(getAccountInfo);
  const dispatch = useAppDispatch();

  const columns: ITableColumn<LoyaltyProjectsScoreboard>[] = [
    {
      header: t({ id: "mvQgo4KA5PRbrth6suFdGk-quest", message: "User" }),
      render: ({ wallet }: LoyaltyProjectsScoreboard) => {
        const isUser = accountInfo?.username
          ? accountInfo?.username === wallet
          : false;

        return (
          <>
            {isUser && <div style={{ zIndex: 0 }} className="decor" />}
            <p
              className={classnames("table-content", {
                "c-font-color-3": isUser,
              })}
            >
              {wallet}
            </p>
          </>
        );
      },
      width: "33%",
      align: "center",
    },
    {
      header: t({
        id: "300d2ede-11e6-11ee-be56-0242ac120002",
        message: "L.Draw",
      }),
      render: ({ status }) => {
        const computeStatus = () => {
          if (status === "winner") return "Winner";
          if (status === "eligible") return "Eligible";
          return "Not Eligible";
        };
        return (
          <p
            className={classnames("table-content", {
              "c-font-color-3": status === "winner" || status === "eligible",
            })}
          >
            {computeStatus()}
          </p>
        );
      },
      width: "33%",
      align: "center",
    },
  ];

  const trackTapEvent = () => {
    dispatch(
      sendAnalyticsDataThunk({ type: "quest_scoreboard_tap", options: {} }),
    );
  };

  return (
    <div
      className={className}
      style={{ position: "relative" }}
      onClick={trackTapEvent}
    >
      {!isScoresLoaded ? (
        <Box p={2}>
          <Loader />
        </Box>
      ) : (
        <>
          {scores && scores.length > 0 ? (
            <TableWrapper isInfoPopup={isInfoPopup}>
              <div className="mobile">
                <ShowMore
                  isOpened={isShowDetails}
                  setIsOpened={setIsShowDetails}
                  showMoreLabel={t({
                    id: "8qKhC7nFzGfamtUWmk3nfc-quest",
                    message: "Scoreboard",
                  })}
                >
                  <Table
                    mobile={0}
                    columns={columns}
                    items={scores}
                    loaded={true}
                    type="secondary"
                    emptyTitle={t({
                      id: "wwMczzboST9VRB1BGkW1qe-quest",
                      message: "You haven't participated in any projects",
                    })}
                    maxHeight={400}
                    handleNext={handleNext}
                    moreLoading={moreLoading}
                  />
                </ShowMore>
              </div>

              <div className="desctop">
                <Table
                  mobile={0}
                  columns={columns}
                  items={scores}
                  loaded={true}
                  type="secondary"
                  emptyTitle={t({
                    id: "pQjzq29HM8YhXeqkirc5H8-quest",
                    message: "You haven't participated in any projects",
                  })}
                  maxHeight={400}
                  handleNext={handleNext}
                  moreLoading={moreLoading}
                />
              </div>
            </TableWrapper>
          ) : (
            <TableDecor>
              <div className="image">
                <LuckyDrawScoreboardStylesEmptyScoreBoard />
              </div>

              <div className="content">
                <Box className="position" mb={2}>
                  <Icon name="luckyDrawPlace" size="40" />
                </Box>

                <p
                  className={classnames(
                    "text",
                    "c-font-16-22 c-font-color c-text-center",
                  )}
                >
                  <Trans id="vmUGdDL7PYn6E49oGfKAdE-quest">
                    No one has started the tasks, be the first and get the first
                    place
                  </Trans>
                </p>
              </div>
            </TableDecor>
          )}
        </>
      )}
    </div>
  );
};

export default LuckyDrawScoreboard;
