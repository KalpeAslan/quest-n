import { useMemo } from "react";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import classnames from "classnames";

import { Icon } from "@components/UI/icon";

import { LoginInfo } from "./components/loginInfo";
import { HowGetProfit } from "./components/howGetProfit";
import { FriendsCompleteTasks } from "./components/friendsCompleteTasks";
import { BlocksWrapper, SliderWrapper } from "./info.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";

const Info = () => {
  const accountInfo = useTypedSelector(getAccountInfo);

  const referralTotal = useMemo(() => {
    if (
      accountInfo?.referralInfo?.referralsCount &&
      accountInfo?.referralInfo?.referralsCount > 0
    ) {
      return accountInfo.referralInfo.referralsCount;
    }

    return 0;
  }, [accountInfo]);

  return (
    <>
      <SliderWrapper>
        <Splide
          options={{
            rewind: false,
            fixedWidth: "257px",
            gap: 12,
            pagination: false,
            trimSpace: false,
            mediaQuery: "min",
            perPage: 1,
            perMove: 1,
            flickPower: 300,
            breakpoints: {
              768: {
                fixedWidth: "",
                perPage: 3,
                perMove: 3,
              },
              910: {
                perPage: 4,
                perMove: 4,
              },
            },
          }}
          tag="section"
          hasTrack={false}
        >
          <div className="list">
            <SplideTrack>
              <SplideSlide>
                <LoginInfo />
              </SplideSlide>

              <SplideSlide>
                <FriendsCompleteTasks />
              </SplideSlide>

              <SplideSlide>
                <HowGetProfit />
              </SplideSlide>

              <div className={classnames("nav", "splide__arrows")}>
                <button
                  className={classnames(
                    "btn",
                    "splide__arrow splide__arrow--prev",
                  )}
                >
                  <Icon
                    size="24"
                    name="arrow-straight"
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </button>

                <button
                  className={classnames(
                    "btn",
                    "splide__arrow splide__arrow--next",
                  )}
                >
                  <Icon
                    size="24"
                    name="arrow-straight"
                    style={{ transform: "rotate(90deg)" }}
                  />
                </button>
              </div>
            </SplideTrack>
          </div>
        </Splide>
      </SliderWrapper>

      <BlocksWrapper className={classnames({ ["active"]: referralTotal > 0 })}>
        <LoginInfo />

        {referralTotal > 0 && <div className="decor" />}

        <FriendsCompleteTasks />

        {referralTotal > 0 && <div className="decor" />}

        <HowGetProfit />
      </BlocksWrapper>
    </>
  );
};

export default Info;
