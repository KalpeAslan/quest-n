import { useMemo } from "react";
import { DateTime } from "luxon";
import { Trans } from "@lingui/macro";
import Image, { StaticImageData } from "next/image";

import { Button } from "@components/UI/button";
import { HeroStylesHero } from "./hero.styles";

type Props = {
  maxCount: number;
  startCountDate: string;
  endCountDate: string;
  heroImage: StaticImageData;
  title: string;
  subTitle: string;
  text: string;
  buttonName: string;
  buttonLink: string;
};

const EventHeroSection = ({
  maxCount,
  startCountDate,
  endCountDate,
  heroImage,
  title,
  subTitle,
  text,
  buttonName,
  buttonLink,
}: Props) => {
  const isEventEnd = useMemo(() => {
    const today = DateTime.now();
    const endDateTimestamp = DateTime.fromISO(endCountDate);

    const dayDifference = Math.ceil(endDateTimestamp.diff(today, "days").days);

    return dayDifference < 0;
  }, [endCountDate]);

  const eventCount = useMemo(() => {
    const startDateTimestamp = DateTime.fromISO(startCountDate);
    const endDateTimestamp = DateTime.fromISO(endCountDate);
    const today = DateTime.now();

    const parts = Math.ceil(
      endDateTimestamp.diff(startDateTimestamp, "days").days,
    );
    const partValue = Math.ceil(maxCount / parts);

    const dayDifference = Math.ceil(endDateTimestamp.diff(today, "days").days);

    if (dayDifference < 0) {
      return maxCount;
    }

    return (parts - dayDifference) * partValue;
  }, []);

  return (
    <HeroStylesHero>
      <h1 className="caption-header">
        <span className="caption-green">{title}</span> {subTitle}
      </h1>

      <p className="sub-caption">{text}</p>

      <Image
        className={"hero-image lazyload"}
        src={heroImage}
        title={"Hero image"}
        alt="hero image"
      />

      <div className={"event"}>
        <h2 className={"event-caption"}>
          <Trans id="mBWTNNk7G8W7GL3uo75uCi-events">Event participants</Trans>
        </h2>

        <p className={"event-count"}>+{eventCount}</p>

        <div className={"progress-bar"}>
          <div
            className={"progress"}
            style={{ width: `${(eventCount / maxCount) * 100}%` }}
          ></div>
        </div>

        <Button
          style="primary"
          className="event-button"
          type="button"
          target="_blank"
          disabled={isEventEnd}
          href={buttonLink}
        >
          {buttonName}
        </Button>
      </div>
    </HeroStylesHero>
  );
};

export default EventHeroSection;
