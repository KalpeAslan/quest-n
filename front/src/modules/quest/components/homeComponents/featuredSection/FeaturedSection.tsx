import { Box } from "@mui/material";
import { Wrapper } from "./featuredSection.styles";
import { FeaturedItem } from "../../FeaturedItem";
import { IQuestShort } from "@/modules/quest/models";
import { FC } from "react";
import Link from "next/link";
import { FeaturedItems } from "../../featuredItems";
import { Trans } from "@lingui/macro";

interface Props {
  quests: IQuestShort[];
}

const FeaturedSection: FC<Props> = ({ quests }) => {
  return (
    <Wrapper>
      <Box
        className="c-font-28-22 c-sm-font-32-36 c-md-font-40-44 c-fw-500 title"
        component="h2"
      >
        <Trans id="o61EVQgTimVNsKmGF5dCNh-home">
          Join quests and{" "}
          <Box component="span" className="c-font-color-3">
            claim rewards
          </Box>
        </Trans>
      </Box>

      <FeaturedItems projects={quests} className="container desktop" />

      <Box className="container mobile">
        {quests.slice(0, 4).map(item => (
          <FeaturedItem key={item.id} className="featuredItem" quest={item} />
        ))}
      </Box>

      <Link href="/quest" className="c-font-color-3 c-font-16-16 c-fw-500 link">
        <Trans id="dDho8ET32ktgErmcSqfB4D-home">Show more</Trans>
      </Link>
    </Wrapper>
  );
};

export default FeaturedSection;
