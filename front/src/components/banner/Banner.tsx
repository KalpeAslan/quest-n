import classNames from "classnames";
import { t, Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import {
  BannerStylesWrapper,
  BannerStylesContent,
  BannerStylesImage,
  BannerStylesLink,
  BannerStylesClose,
} from "@components/banner/banner.styles";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { setIsBunnerClosed } from "@store/slices/system/system.slice";
import Image from "next/image";
import bunnerImage from "@assets/images/bunner/bear2.webp";
import { IBunnerData } from "@/models";

const Banner = () => {
  const dispatch = useAppDispatch();

  const bunnerData: IBunnerData = {
    title: t({
      id: "26YwMKQ1hz7M2aXMxqZEcG-BunnerType",
      message:
        "AlphaGuilty twitter space with KOL's about 2023 trends. Friday, January 6th.",
    }),
    linkTo: "/events/twitterspace2",
    image: bunnerImage.src,
  };

  return (
    <BannerStylesWrapper>
      <BannerStylesContent>
        {bunnerData.image && (
          <BannerStylesImage>
            <Image
              className="lazyload"
              src={bunnerData.image}
              alt={bunnerData.title}
            />
          </BannerStylesImage>
        )}

        <p className={classNames("c-font-16-22 c-fw-500")}>
          {bunnerData.title}
        </p>

        <BannerStylesLink
          className={"c-font-16-22 c-fw-500"}
          href={bunnerData.linkTo}
        >
          <Trans id="dGbCg1T6nNxeJBRCWHBdtm-banner">Learn More</Trans>
        </BannerStylesLink>
      </BannerStylesContent>

      <BannerStylesClose
        type="button"
        onClick={() => dispatch(setIsBunnerClosed(true))}
      >
        <Icon name="menu-close" height="17" width="17" />
      </BannerStylesClose>
    </BannerStylesWrapper>
  );
};

export default Banner;
