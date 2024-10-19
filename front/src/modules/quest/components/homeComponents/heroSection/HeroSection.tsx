import { Box } from "@mui/material";
import { Wrapper } from "./heroSection.styles";
import { Button } from "@/components/UI/button";
import { useRouter } from "next/router";
import { TypeAnimation } from "react-type-animation";
import { Icon } from "@/components/UI/icon";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@/modules/account/store/account.selector";
import { useClaimExperienceStarter } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { loyaltyService } from "@/api";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setLoginPrevLocation } from "@/store/slices/system/system.slice";
import { Trans, t } from "@lingui/macro";

const HeroSection = () => {
  const [onboardingLinkTitle, setOnboardingLinkTitle] = useState<string | null>(
    null,
  );

  const { push } = useRouter();

  const dispatch = useAppDispatch();

  const accountInfo = useTypedSelector(getAccountInfo);

  const { isClaimed: isStarterClaimed } = useClaimExperienceStarter();

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
        component="h1"
        textTransform="uppercase"
        className="c-font-36-40 c-sm-font-50-55 c-md-font-65-72 c-fw-700 title"
      >
        <Trans id="qcTcKH6wjy5y778Q5KgcNT-home">
          web3 growth platform
          <br />
          to{" "}
          <Box component="span" className="c-font-color-3">
            <TypeAnimation
              sequence={[
                t({
                  id: "1s9WAigYK5frM2c5Vo8aeg-home",
                  message: "earn rewards",
                }),
                1000,
                t({
                  id: "wzfaUMZiEvE3g3UmDXYL9V-home",
                  message: "earn crypto",
                }),
                1000,
                t({ id: "p8kk8WkPDebPEc78X9N6Ea-home", message: "earn nft" }),
                1000,
                t({
                  id: "3mZe2Wux4Dsd7uWsxw4WZU-home",
                  message: "earn white lists",
                }),
                1000,
              ]}
              speed={50}
              repeat={Infinity}
            />
          </Box>
          <br />& community engagement
        </Trans>
      </Box>

      <Button
        style="primary"
        className="mainButton"
        onClick={() => {
          if (!accountInfo?.connected) {
            dispatch(
              setLoginPrevLocation(
                onboardingLinkTitle
                  ? `/quest/${onboardingLinkTitle}`
                  : "/quest",
              ),
            );
            return;
          }
          if (isStarterClaimed) {
            push("/quest");
            return;
          }

          push(
            onboardingLinkTitle ? `/quest/${onboardingLinkTitle}` : "/quest",
          );
        }}
      >
        <>
          <Trans id="7NbjPUEZtck1DJ4mHtfbUo-home">Start earning</Trans>
          <Icon name="wallet-main" className="icon" size="18" />
        </>
      </Button>
    </Wrapper>
  );
};

export default HeroSection;
