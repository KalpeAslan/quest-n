import { FC } from "react";
import { Box } from "@mui/material";
import classnames from "classnames";
import { t, Trans } from "@lingui/macro";

import { ITableColumn } from "@models";
import { LoyaltyProjectsLuckyDrawWinner } from "@modules/quest/models";
import { Table } from "@components/UI/table";
import { Icon } from "@components/UI/icon";
import { Loader } from "@components/UI/loader";
import { ShowMore } from "@components/UI/showMore";

import scoreboard from "@assets/images/scoreboard/scoreboard.webp";

import { TableDecor, TableWrapper } from "./scoreboard.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import Image from "next/image";
import { IAccount } from "@modules/account/models";
import { appConfig } from "@/app.config";

type ScoreboardProps = {
  className?: string;
  scores: LoyaltyProjectsLuckyDrawWinner[];
  isScoresLoaded: boolean;
  isShowDetails: boolean;
  setIsShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  isInfoPopup?: boolean;
  handleNext: () => any;
  moreLoading?: boolean;
  hideShowMore?: boolean;
};

const LuckyDrawWinnersBoard: FC<ScoreboardProps> = ({
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
  const accountInfo = useTypedSelector(getAccountInfo) as IAccount;
  const dispatch = useAppDispatch();

  const columns: ITableColumn<LoyaltyProjectsLuckyDrawWinner>[] = [
    {
      header: t({ id: "mvQgo4KA5PRbrth6suFdGk-quest", message: "User" }),
      render: ({ username, investorId }: LoyaltyProjectsLuckyDrawWinner) => {
        const isUser = accountInfo
          ? accountInfo?.investorId === investorId
          : false;

        return (
          <>
            <div style={{ zIndex: 0 }} className="decor" />
            <p
              className={classnames("table-content", {
                "c-font-color-3": isUser,
              })}
            >
              {username}
            </p>
          </>
        );
      },
      width: "50%",
      align: "flex-start",
    },
    {
      header: "",
      render: ({ image, username }: LoyaltyProjectsLuckyDrawWinner) => {
        return (
          <>
            <div style={{ zIndex: 0 }} className="decor" />
            <p className={"table-content"}>
              <Image
                style={{borderRadius: "100%"}}
                width={30}
                height={30}
                alt={username}
                src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${image}`}
              />
            </p>
          </>
        );
      },
      width: "50%",
      align: "flex-end",
    },
  ];

  const trackTapEvent = () => {
    dispatch(
      sendAnalyticsDataThunk({
        type: "quest_luckyDrawWinnersBoard_tap",
        options: {},
      }),
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
            <TableWrapper className={"luckydraw"} isInfoPopup={isInfoPopup}>
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

export default LuckyDrawWinnersBoard;
