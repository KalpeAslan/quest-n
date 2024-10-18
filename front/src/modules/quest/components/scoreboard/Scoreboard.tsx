import { FC } from "react";
import { Box } from "@mui/material";
import classnames from "classnames";
import { t, Trans } from "@lingui/macro";

import { HelperService } from "@services";
import { ITableColumn } from "@models";
import { LoyaltyProjectsScoreboard } from "@modules/quest/models";
import { Table } from "@components/UI/table";
import { Icon } from "@components/UI/icon";
import { Loader } from "@components/UI/loader";
import { ShowMore } from "@components/UI/showMore";

import scoreboard from "@assets/images/scoreboard/scoreboard.webp";

import { TableDecor, TablePlace, TableWrapper } from "./scoreboard.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import Image from "next/image";

type ScoreboardProps = {
  className?: string;
  scores: LoyaltyProjectsScoreboard[];
  isScoresLoaded: boolean;
  isShowDetails: boolean;
  setIsShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  isInfoPopup?: boolean;
  handleNext: () => any;
  moreLoading?: boolean;
  hideShowMore?: boolean;
};

const Scoreboard: FC<ScoreboardProps> = ({
  className,
  scores,
  isScoresLoaded,
  isShowDetails,
  setIsShowDetails,
  handleNext,
  isInfoPopup,
  moreLoading,
  hideShowMore,
}) => {
  const accountInfo = useTypedSelector(getAccountInfo);
  const dispatch = useAppDispatch();

  const columns: ITableColumn<LoyaltyProjectsScoreboard>[] = [
    {
      header: t({ id: "spLriCh95eo5wgSBCCK1rB-quest", message: "Place" }),
      render: ({ place, wallet }: LoyaltyProjectsScoreboard) => {
        const isUser = accountInfo?.username
          ? accountInfo?.username === wallet
          : false;

        return (
          <TablePlace>
            {place < 4 && (
              <Icon
                className={classnames("table-content", "decor")}
                name={`place-${place}`}
                size="20"
              />
            )}

            <p
              className={classnames("table-content", {
                "c-font-color-3": isUser,
                "c-font-color-12": place < 4,
              })}
            >
              {place}
            </p>
          </TablePlace>
        );
      },
      width: "33%",
      align: "center",
    },
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
      header: t({ id: "ew3koWNz9qcSLS3po6UFQ2-quest", message: "Points" }),
      render: ({ earnedPoints, wallet }: LoyaltyProjectsScoreboard) => {
        const number = earnedPoints.toFixed(2);
        const isUser = accountInfo?.username
          ? accountInfo?.username === wallet
          : false;

        return (
          <p
            className={classnames("table-content", {
              "c-font-color-3": isUser,
            })}
          >
            {HelperService.addNumberSeparator(number)}
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
                {hideShowMore ? (
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
                    stickyFirstPlace={true}
                    moreLoading={moreLoading}
                  />
                ) : (
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
                      stickyFirstPlace={true}
                      moreLoading={moreLoading}
                    />
                  </ShowMore>
                )}
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
                  stickyFirstPlace={true}
                  moreLoading={moreLoading}
                />
              </div>
            </TableWrapper>
          ) : (
            <TableDecor>
              <div className="image">
                <Image
                  className="lazyload"
                  src={scoreboard}
                  title="scoreboard"
                  alt=""
                />
              </div>

              <div className="content">
                <Box className="position" mb={2}>
                  <Icon name="place-1" size="40" />

                  <p
                    className={classnames(
                      "point",
                      "c-font-16-22 c-font-color-12 c-text-center",
                    )}
                  >
                    1
                  </p>
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

export default Scoreboard;
