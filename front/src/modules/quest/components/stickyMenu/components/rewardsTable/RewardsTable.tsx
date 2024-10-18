import { Box } from "@mui/material";
import { InfoItem, Wrapper } from "./rewardsTable.styles";
import { RewardTable } from "@/modules/quest/models";
import { FC, useState } from "react";
import { ShowMore } from "@/components/UI/showMore";
import { Trans } from "@lingui/macro";

interface Props {
  rewardsTable: RewardTable[];
  className?: string;
}

const RewardTableItem: FC<{ item: RewardTable }> = ({ item }) => (
  <InfoItem mb={0.5}>
    <p className={"c-font-16-20 c-font-color c-nowrap"}>{item.place}</p>

    <div className="info-decor" />

    <p className={"c-font-16-20 c-font-color-3 c-text-right"}>
      {item.placeRewards}
    </p>
  </InfoItem>
);

const RewardsTable: FC<Props> = ({ rewardsTable, className }) => {
  const [showMoreOpen, setShowMoreOpen] = useState<boolean>(false);

  return (
    <Wrapper className={className}>
      <Box
        className="c-font-16-22 c-fw-500 c-font-color c-text-center c-flex-center"
        component="p"
        mb={1}
      >
        <Trans id="xgcEB6uuWniCzAmcXgoSPz-quest">Reward Distribution</Trans>
      </Box>

      {rewardsTable.slice(0, 5).map((item: RewardTable) => (
        <RewardTableItem item={item} key={item.place} />
      ))}

      {rewardsTable.length > 5 && (
        <ShowMore
          isOpened={showMoreOpen}
          setIsOpened={setShowMoreOpen}
          hideIcon={true}
          headerClassName="showMoreHeader"
          buttonClassName="showMoreButton"
        >
          {rewardsTable.slice(5).map((item: RewardTable) => (
            <RewardTableItem item={item} key={item.place} />
          ))}
        </ShowMore>
      )}
    </Wrapper>
  );
};

export default RewardsTable;
