// import { useMemo } from "react";
// import { Box } from "@mui/system";
// import { t, Trans } from "@lingui/macro";
//
// import { ShowMore } from "@components/UI/showMore";
// import { Table } from "@components/UI/table";
// import { Gauge } from "@components/UI/charts/gauge";
// import { HelperService } from "@services";
// import { ITableColumn, ILevel } from "@models";
//
// import { Info } from "./components/info";
// import { Lvl } from "./components/lvl";
// import { AlphaguiltyIncomeWrapper } from "./alphaguiltyIncome.styles";
// import { useTypedSelector } from "@/hooks/useTypedSelector";
// import { getAccountInfo } from "@modules/account/store/account.selector";
// import { appConfig } from "@/app.config";
// import {
//   investorRuleLevels,
//   namedLevels,
// } from "@modules/account/components/aqBalance/components/alphaguiltyIncome/consts";
// import { IAccount } from "@modules/account/models";

const AlphaguiltyIncome = () => {
  return <></>;
  // const accountInfo: IAccount = useTypedSelector(getAccountInfo);
  //
  // const alphaLoyalty = useMemo(() => {
  //   if (accountInfo.questInfo) {
  //     return accountInfo.questInfo.questProfit;
  //   }
  //
  //   return 0;
  // }, [accountInfo]);
  //
  // const referralIncome: number = useMemo(() => {
  //   if (accountInfo?.referralInfo?.referralProfit) {
  //     return +accountInfo.referralInfo.referralProfit.referralProfit;
  //   }
  //
  //   return 0;
  // }, [accountInfo]);
  //
  // const totalTokens: number = useMemo(() => {
  //   if (accountInfo.questInfo) {
  //     return +accountInfo.questInfo.questProfit + referralIncome;
  //   }
  //
  //   return 0;
  // }, [accountInfo, referralIncome]);
  //
  // const levels: ILevel[] = investorRuleLevels;
  //
  // const currentLevel: ILevel | null = useMemo(() => {
  //   if (accountInfo?.currentLevel) {
  //     return accountInfo.currentLevel;
  //   }
  //
  //   return null;
  // }, [accountInfo]);
  //
  // const claimedTokens: number = useMemo(() => {
  //   if (
  //     accountInfo?.referralInfo.referralProfit &&
  //     accountInfo?.referralInfo.referralProfit.referralProfit
  //   ) {
  //     return accountInfo.referralInfo.referralProfit.referralProfit;
  //   }
  //
  //   return 0;
  // }, [accountInfo]);
  //
  // const nextLevel = useMemo(() => {
  //   const levelIndex = namedLevels.findIndex(
  //     level => level.name === currentLevel?.name,
  //   );
  //
  //   if (levelIndex !== -1 && namedLevels[levelIndex + 1]) {
  //     return namedLevels[levelIndex + 1];
  //   }
  //
  //   if (levelIndex !== -1 && !namedLevels[levelIndex + 1]) {
  //     const filteredLevels = levels.filter(
  //       (level: ILevel) => level.name === currentLevel?.name,
  //     );
  //
  //     const levelIndex = filteredLevels.findIndex(
  //       (level: ILevel) => level.tokensFrom > totalTokens,
  //     );
  //
  //     if (levelIndex !== -1) {
  //       return filteredLevels[levelIndex];
  //     }
  //   }
  //
  //   return null;
  // }, [namedLevels, totalTokens, currentLevel]);
  //
  // const columns: ITableColumn<ILevel>[] = [
  //   {
  //     header: "User points",
  //     render: ({ tokensFrom }: ILevel) => {
  //       const tokens = tokensFrom || 0;
  //
  //       return (
  //         <p className="table-content">
  //           {HelperService.addNumberSeparator(tokens)} AQ
  //         </p>
  //       );
  //     },
  //     width: "33%",
  //     align: "center",
  //   },
  //   {
  //     header: "Names",
  //     render: ({ name }: ILevel) => <p className="table-content">{name}</p>,
  //     width: "33%",
  //     align: "center",
  //   },
  //   {
  //     header: "Levels",
  //     render: ({ place }: ILevel) => <p className="table-content">{place}</p>,
  //     width: "33%",
  //     align: "center",
  //   },
  // ];
  //
  // return (
  //   <AlphaguiltyIncomeWrapper>
  //     <Box component="header" className="header">
  //       <p className="c-font-14-20 c-font-color">
  //         <Trans id="qaQwKr6M8LcyUoqmoy4pTR-account">AlphaGuilty Income</Trans>
  //       </p>
  //     </Box>
  //
  //     {currentLevel !== null && totalTokens >= 0 && levels.length > 0 && (
  //       <Box mb={2}>
  //         <Gauge
  //           totalTokens={totalTokens}
  //           currentLevel={currentLevel}
  //           levels={levels}
  //           nextLevel={nextLevel}
  //         />
  //       </Box>
  //     )}
  //
  //     <Box
  //       className="info"
  //       mb={2}
  //       mt={{ xs: currentLevel && nextLevel && totalTokens && levels ? 0 : 2 }}
  //     >
  //       <Info
  //         title={t({
  //           id: "hwF1hYCYq5G4U9rNtee3Qv-account",
  //           message: "Referral Income",
  //         })}
  //         subtitle={t({
  //           id: "a7FM8yY3FcKRuvCvoepJoq-account",
  //           message: "Claimed",
  //         })}
  //         points={claimedTokens}
  //       />
  //
  //       <Info
  //         title={t({
  //           id: "9MWUmouFGp1TfKimmoZDcn-account",
  //           message: "AlphaQuest",
  //         })}
  //         subtitle=""
  //         points={alphaLoyalty}
  //       />
  //     </Box>
  //
  //     <Box overflow={"auto"} maxWidth={400} className="footer" mb={1.5}>
  //       {namedLevels.length > 0 &&
  //         namedLevels.map((level: ILevel) => (
  //           <Lvl
  //             key={level.name}
  //             image={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${level.avatar}`}
  //             points={level.tokensFrom}
  //             name={level.name}
  //             highlited={currentLevel?.name === level.name}
  //           />
  //         ))}
  //     </Box>
  //
  //     {namedLevels && namedLevels.length ? (
  //       <ShowMore>
  //         <Box>
  //           <Box
  //             component="p"
  //             className="c-font-14-20 c-font-color"
  //             mt={1}
  //             mb={1}
  //           >
  //             <Trans id="oL57meJFNxgc7nCaM93bZz-account">
  //               AlphaGuilty Levels
  //             </Trans>
  //           </Box>
  //
  //           <Table
  //             mobile={0}
  //             columns={columns}
  //             items={namedLevels}
  //             loaded={true}
  //             type="third"
  //           />
  //         </Box>
  //       </ShowMore>
  //     ) : null}
  //   </AlphaguiltyIncomeWrapper>
  // );
};

export default AlphaguiltyIncome;
