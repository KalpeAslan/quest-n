import { Box, CircularProgress } from "@mui/material";
import { useMemo, useState } from "react";
import { QuestWinnersAnalytics } from "@modules/quest/components/QuestAnalyticsTables/QuestWinnersAnalytics";
import { QuestAnalyticsEligibleUsers } from "@modules/quest/components/QuestAnalyticsTables/QuestAnalyticsEligibleUsers";
import {
  useGetQuestAnalyticsEligibleUsersQuery,
  useGetQuestAnalyticsWinnersQuery,
} from "@modules/quest/hooks/quest.api";
import classNames from "classnames";
import { Trans } from "@lingui/macro";
import Button from "../../../../components/UI/button/Button";
import { IQuestAnalyticsWinners } from "@models";
import csvDownload from "json-to-csv-export";
import { useDebouncedEffect } from "@hooks";
import { QuestAnalyticsTablesStyles } from "@modules/quest/components/QuestAnalyticsTables/QuestAnalyticsTables.styles";
import SearchInput from "../../../../components/searchInput/SearchInput";
import { EProjectType } from "@modules/quest/models";
import { getOrdinal } from "@/utils";

enum ESelectedTab {
  WINNERS = "winners",
  ELIGIBLE_USERS = "eligible_users",
}

interface IProps {
  questLinkTitle: string;
  questType: EProjectType | null;
}

export const QuestAnalyticsWinnersAndEligibleUsers = ({
  questLinkTitle,
  questType,
}: IProps) => {
  const [selectedTab, setSelectedTab] = useState<ESelectedTab>(
    ESelectedTab.WINNERS,
  );

  const { data: winners, isLoading: isWinnersLoading } =
    useGetQuestAnalyticsWinnersQuery(questLinkTitle);

  const { data: eligibleUsers, isLoading: isEligibleUsersLoading } =
    useGetQuestAnalyticsEligibleUsersQuery(questLinkTitle, {
      skip: selectedTab !== ESelectedTab.ELIGIBLE_USERS,
    });

  const selectedData =
    ((selectedTab === ESelectedTab.WINNERS
      ? winners
      : eligibleUsers) as IQuestAnalyticsWinners[]) || [];

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const filteredData = useMemo(() => {
    if (!debouncedSearch) return selectedData;
    return selectedData.filter(item =>
      item.username.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [debouncedSearch, selectedTab, eligibleUsers, winners]);

  useDebouncedEffect(
    () => {
      setDebouncedSearch(search);
    },
    {
      ignoreInitialCall: true,
      timeout: 3000,
    },
    [search],
  );

  const handleClickCSV = () => {
    const data = selectedData.map(item => {
      const values = {
        Username: item.username || "-",
        Wallet: item.walletAddress || "-",
        "Claiming Status": item.isClaimed ? "Claimed" : "Not Claimed",
        Email: item.emailUserEmail || "-",
        Twitter: item.twitterUsername || "-",
        Discord: item.discordUsername || "-",
        Telegram: item.discordUsername || "-",
      };

      if (questType === EProjectType.Scoreboard)
        values["Place"] = getOrdinal(+item.place);
      return values;
    });

    const headers = [
      "Username",
      "Wallet",
      "Claiming Status",
      "Email",
      "Twitter",
      "Discord",
      "Telegram",
    ];
    if (questType === EProjectType.Scoreboard) headers.push("Place");

    return csvDownload({
      data,
      filename:
        selectedTab === ESelectedTab.WINNERS
          ? `${questLinkTitle}_winners`
          : `${questLinkTitle}_eligible_users`,
      headers,
    });
  };

  const isCsvDisabled = useMemo(() => {
    if (isWinnersLoading || isEligibleUsersLoading) return true;
    if (!selectedTab || !selectedData.length) return true;
    return false;
  }, [winners, eligibleUsers, isEligibleUsersLoading, isWinnersLoading]);

  const renderTable = () => {
    if (isWinnersLoading || isEligibleUsersLoading)
      return (
        <Box
          p={3}
          className={"c-font-color-3"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
        >
          <CircularProgress color="inherit" size={40} />
        </Box>
      );

    switch (selectedTab) {
      case ESelectedTab.WINNERS:
        return (
          <QuestWinnersAnalytics
            data={filteredData}
            dataExist={winners?.length}
            questType={questType}
          />
        );
      case ESelectedTab.ELIGIBLE_USERS:
        return (
          <QuestAnalyticsEligibleUsers
            data={filteredData}
            dataExist={(eligibleUsers || []).length}
          />
        );
    }
  };

  return (
    <QuestAnalyticsTablesStyles>
      <Box
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        className={"quest-analytics_winners-and-eligible-users__header"}
        justifyContent={"space-between"}
        mb={5}
      >
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <Box
            component={"p"}
            onClick={() => setSelectedTab(ESelectedTab.WINNERS)}
            sx={{
              opacity: selectedTab === ESelectedTab.ELIGIBLE_USERS ? 0.5 : 1,
            }}
            className={classNames("c-font-20-22 c-fw-500 c-pointer", {
              "c-font-color-3": selectedTab === ESelectedTab.WINNERS,
              "c-font-color": selectedTab === ESelectedTab.ELIGIBLE_USERS,
            })}
          >
            <Trans id={"dl567jbvnfg34j-bdfn23-sdnbeljbgf-Winners"}>
              Winners
            </Trans>
          </Box>
          {questType !== EProjectType.Scoreboard && (
            <Box
              component={"p"}
              onClick={() => setSelectedTab(ESelectedTab.ELIGIBLE_USERS)}
              sx={{
                opacity: selectedTab === ESelectedTab.WINNERS ? 0.5 : 1,
              }}
              className={classNames("c-font-20-22 c-fw-500 c-pointer", {
                "c-font-color-3": selectedTab === ESelectedTab.ELIGIBLE_USERS,
                "c-font-color": selectedTab === ESelectedTab.WINNERS,
              })}
            >
              <Trans id={"234dl567jbvnfg34j-bdfn23-sdnbeljbgf-Winners"}>
                Eligible Users
              </Trans>
            </Box>
          )}
        </Box>

        <Box
          className={"search-input-wrapper"}
          display={"flex"}
          alignItems={"center"}
        >
          <SearchInput
            onSearch={v => setSearch(v)}
            inputValue={search}
            setInputValue={setSearch}
            items={selectedData.map(item => item.username)}
          />
          <Button
            className={"quest-analytics__csv"}
            onClick={handleClickCSV}
            style={"colorfull"}
            disabled={isCsvDisabled}
          >
            <Trans id={"vlnd-56[pcsrtb2nwv9-csv"}>
              Export all data in .csv
            </Trans>
          </Button>
        </Box>
      </Box>

      {renderTable()}
    </QuestAnalyticsTablesStyles>
  );
};
