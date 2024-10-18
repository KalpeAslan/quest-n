import { Box } from "@mui/material";
import { Wrapper } from "./trendingItems.styles";
import { Button } from "@/components/UI/button";
import { useRouter } from "next/router";
import { IQuestShort } from "../../models";
import { FC } from "react";
import { TrendingItem } from "./trendingItem";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { Trans } from "@lingui/macro";

interface Props {
  projects: IQuestShort[];
}

const TrendingItems: FC<Props> = ({ projects }) => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();

  const onShowMoreClick = () => {
    dispatch(sendAnalyticsDataThunk({ type: "show_more_tap", options: {} }));
    push("/explore");
  };

  return (
    <Wrapper component="section">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box
          component="h2"
          className="c-font-23-24 c-sm-font-32-38 c-fw-500"
          sx={{ color: "#ffffff" }}
        >
          <Trans id="74zAVGm47mhe31qoZLcG8y-quest">Trending Quests</Trans>
        </Box>

        <Button style="secondary" onClick={onShowMoreClick}>
          <Trans id="qRnEPycBDwdnvMtDCBs6Qq-quest">Show more</Trans>
        </Button>
      </Box>

      <Box className="projectItems">
        {projects.map((item, idx) => (
          <TrendingItem key={item.id} project={item} index={idx} />
        ))}
      </Box>

      <Button
        style="secondary"
        className="mobile-show c-full-width"
        onClick={onShowMoreClick}
      >
        <Trans id="qRnEPycBDwdnvMtDCBs6Qq-quest">Show more</Trans>
      </Button>

      {/*<Box component="p" className="text c-font-16-22 c-fw-400">*/}
      {/*  <Trans id="t3bsBmng41qfoTPKRYKNXa-quest">*/}
      {/*    Seo text uniswap flow XRP celo maker amp fantom XRP revain. Dash*/}
      {/*    stellar helium litecoin uniswap hedera dash digibyte stellar. Uniswap*/}
      {/*    arweave amp celsius litecoin TRON IOTA. PancakeSwap tezos monneo enjin*/}
      {/*    filecoin. Decred bin helium avalanche tezos.*/}
      {/*  </Trans>*/}
      {/*</Box>*/}
    </Wrapper>
  );
};

export default TrendingItems;
