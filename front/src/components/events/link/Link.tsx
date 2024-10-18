import { useMemo } from "react";
import { DateTime } from "luxon";
import speakerImage from "@assets/images/global-event/speaker.webp";

import {
  LinkStylesWrapper,
  LinkStylesImage,
  LinkStylesButton,
  LinkStylesCaption,
} from "./link.styles";

type Props = {
  title: string;
  buttonName: string;
  buttonLink: string;
  activeDate: string;
  disabledDate: string;
};

const EventLinkSection = ({
  title,
  buttonName,
  buttonLink,
  activeDate,
  disabledDate,
}: Props) => {
  const isDisabled = useMemo(() => {
    const today = DateTime.now().toUTC();
    const activeDateTimestamp = DateTime.fromISO(activeDate).toUTC();
    const disablesDateTimestamp = DateTime.fromISO(disabledDate).toUTC();

    const activeDifference = Math.ceil(
      activeDateTimestamp.diff(today, "minutes").minutes,
    );
    const disaledDifference = Math.ceil(
      disablesDateTimestamp.diff(today, "minutes").minutes,
    );

    if (activeDifference <= 0 && disaledDifference > 0) {
      return false;
    }

    return true;
  }, [activeDate]);

  return (
    <section>
      <LinkStylesWrapper>
        <LinkStylesImage
          className={"lazyload"}
          src={speakerImage}
          alt="speaker image"
        />

        <LinkStylesCaption>{title}</LinkStylesCaption>

        <LinkStylesButton
          style="primary"
          type="button"
          href={buttonLink}
          disabled={isDisabled}
          target="_blank"
        >
          {buttonName}
        </LinkStylesButton>
      </LinkStylesWrapper>
    </section>
  );
};

export default EventLinkSection;
