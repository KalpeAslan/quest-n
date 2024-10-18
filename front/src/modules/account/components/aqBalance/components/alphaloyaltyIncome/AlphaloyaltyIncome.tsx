import { useMemo } from "react";
import { Box } from "@mui/system";
import classnames from "classnames";
import { Trans } from "@lingui/macro";

import { IALoyaltyProjects } from "@modules/account/models";

import Link from "next/link";
import { AlphaLoyaltyIncomeWrapper } from "./alphaloyaltyIncome.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { useBoolean } from "@hooks/useBoolean";

const AlphaLoyaltyIncome = () => {
  const accountInfo = useTypedSelector(getAccountInfo);

  const { value: showProjects, toggle } = useBoolean();
  const alphaLoyalty: number = useMemo(() => {
    if (accountInfo.questInfo) {
      return +Number(accountInfo.questInfo.questProfit).toFixed(2);
    }

    return 0;
  }, [accountInfo]);

  const totalProjects: number = useMemo(() => {
    if (accountInfo?.questInfo) {
      return accountInfo.questInfo.completedQuests.length;
    }

    return 0;
  }, [accountInfo]);

  const completedTasksNumber: number = useMemo(() => {
    if (accountInfo?.questInfo?.completedTasksNumber) {
      return accountInfo.questInfo.completedTasksNumber;
    }

    return 0;
  }, [accountInfo]);

  const loyaltyProjects: IALoyaltyProjects[] = useMemo(() => {
    if (accountInfo?.questInfo) {
      return accountInfo.questInfo.completedQuests;
    }

    return [];
  }, [accountInfo.questInfo]);

  return (
    <AlphaLoyaltyIncomeWrapper>
      <Box component="header" className="header" mb={1.5}>
        <p className="c-font-14-20 c-font-color">
          <Trans id="8uYYWvhQVY95JJzFaWThK6-account">AlphaQuest Income</Trans>
        </p>

        <Link href="/quest" className={classnames("link", "c-font-14-20")}>
          <Trans id="hK8A4Sbx1KzMiA5hL1VE3x-account">All projects</Trans>
        </Link>
      </Box>

      <Box className="cont">
        <p className="c-font-grad c-font-32-36 c-inline-block">
          {alphaLoyalty} AQ
        </p>

        {totalProjects === 0 ? (
          <p className="c-font-14-20 c-font-color">
            <Trans id="5wbPLYyYXukiehkm87orpQ-account">
              You haven&apos;t started yet
            </Trans>
          </p>
        ) : (
          <p className="c-font-14-20 c-font-color">
            <Trans id="jZGfKbg2zB8zPGUVLHgWPL-account">
              You did {completedTasksNumber} Tasks in {totalProjects} Projects
            </Trans>
          </p>
        )}

        {1 ? (
          <>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box
                component="p"
                className="c-font-14-20 c-font-color-3"
                mt={2}
                mb={1}
              >
                <Trans id="xhu1gvNjkgLkP5pSV7ZiBo-account">
                  Top 5 projects
                </Trans>
              </Box>
              <p onClick={toggle} className="c-font-14-20 c-font-color-3 c-pointer">
                {!showProjects ? (
                  <Trans id={"htrvbnjgsdjkvd-dfjkbf"}>Show</Trans>
                ) : (
                  <Trans id={"xtrvbnjgsdjkvd-dfjkbf"}>Hide</Trans>
                )}
              </p>
            </Box>

            {showProjects && (
              <Box className="info">
                {loyaltyProjects
                  .slice(0, 5)
                  .map((project: IALoyaltyProjects) => (
                    <Box className={"info-item"} key={project.title}>
                      <p
                        className={classnames(
                          "info-item-title",
                          "c-font-12-16 c-font-color",
                        )}
                      >
                        {project.title}
                      </p>

                      <div className={"info-decor"} />

                      <p className="c-font-12-16 c-font-color c-nowrap c-text-right">
                        {project.profit} AQ
                      </p>
                    </Box>
                  ))}
              </Box>
            )}
          </>
        ) : (
          <Box component="p" className="c-font-14-20 c-font-color-3" mt={2}>
            <Trans id="r7e4miLhV7uu8XharFz4e3-account">
              The best projects will be shown here
            </Trans>
          </Box>
        )}
      </Box>
    </AlphaLoyaltyIncomeWrapper>
  );
};

export default AlphaLoyaltyIncome;
