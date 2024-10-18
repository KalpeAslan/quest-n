import { Box } from "@mui/material";
import { Wrapper } from "./howItWorks.styles";
import { profileImg, rewardsImg, scoreboardImg } from "@/modules/quest/assets";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { loyaltyService } from "@/api";
import { Icon } from "@/components/UI/icon";
import { useRouter } from "next/router";
import { Trans, t } from "@lingui/macro";

const HowItWorks = () => {
  const [onboardingLinkTitle, setOnboardingLinkTitle] = useState<string | null>(
    null,
  );

  const { push } = useRouter();

  const howItWorksItems = useMemo(
    () => [
      {
        image: scoreboardImg,
        title: t({
          id: "kExNNNerkFhkPX9sKfWNN1-home",
          message: "Engage in Quests",
        }),
        description: t({
          id: "rFp3Uw9C2PmKgTXSx7RhfC-home",
          message: "Participate in quests alongside 500k+ WEB3 enthusiasts",
        }),
        link: "/quest",
        linkTitle: t({
          id: "mqi84PYHXvUt5TofAATnYX-home",
          message: "Dive into quests",
        }),
      },
      {
        image: rewardsImg,
        title: t({
          id: "w6o3EzZTMF2U27yhynYBSY-home",
          message: "Earn Rewards",
        }),
        description: t({
          id: "hmsxd5poiLhqC3Evs6i9EX-home",
          message: "Acquire Crypto Tokens, NFTs, Exclusive Access",
        }),
        link: onboardingLinkTitle ? `/quest/${onboardingLinkTitle}` : "/quest",
        linkTitle: t({
          id: "s4B2JuK4qmXiaGcsr7Evns-home",
          message: "Start earning",
        }),
      },
      {
        image: profileImg,
        title: t({
          id: "2LdiZgJk8t3PHwgFMW5oTk-home",
          message: "Enhance your profile",
        }),
        description: t({
          id: "iV2AiC7sv38CukVLo3Jnsd-home",
          message: "Accumulate Experience, Unlock New Benefits",
        }),
        link: "/profile/experience",
        linkTitle: t({
          id: "8zUwQxg6X9GvdGxXjubC6S-home",
          message: "Explore your profile",
        }),
      },
    ],
    [onboardingLinkTitle],
  );

  const getOnboardingLinkTitle = useCallback(async () => {
    const { data } = await loyaltyService.getOnboardingQuestLinkTitle();

    setOnboardingLinkTitle(data.linkTitle);
  }, []);

  useEffect(() => {
    getOnboardingLinkTitle();
  }, [getOnboardingLinkTitle]);

  return (
    <Wrapper component="section">
      <Box
        component="h2"
        className="c-font-28-22 c-sm-font-32-22 c-md-font-40-40 c-fw-500 title"
      >
        <Trans id="fmicosseDNwStuKrMhNYPW-home">How it works</Trans>
      </Box>

      <Box className="container">
        {howItWorksItems.map((item, index) => (
          <Box key={item.link} className="howItWorksItem">
            <Box className="itemTopWrapper">
              <Box className="head">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={35}
                  height={32}
                  className="image"
                />

                <Icon
                  name={index === 2 ? "homeCheck" : "homeArrowDown"}
                  className="icon mobile"
                />

                <Icon
                  name={index === 2 ? "homeCheck" : "homeArrowRight"}
                  className="icon desktop"
                />
              </Box>

              <Box className="c-font-color-3 c-font-24-24 c-sm-font-30-30 c-fw-500 itemTitle">
                {item.title}
              </Box>

              <Box className="c-font-14-14 c-sm-font-18-20 c-fw-500 description">
                {item.description}
              </Box>
            </Box>

            <Box
              onClick={() => {
                push(item.link);
              }}
              className="c-font-color-3 c-font-12-12 c-fw-500 link"
            >
              {item.linkTitle}
            </Box>
          </Box>
        ))}
      </Box>
    </Wrapper>
  );
};

export default HowItWorks;
