import { Trans } from "@lingui/macro";
import { FC } from "react";
import Countdown from "react-countdown";

const renderer = ({ formatted }: any) => {
  return (
    <span>
      <Trans id="gULRo6zBAsonLVVmRcqtV4-countDown">
        {formatted.days}d : {formatted.hours}h : {formatted.minutes}m :{" "}
        {formatted.seconds}s
      </Trans>
    </span>
  );
};

interface CountDownrops {
  className?: string;
  date: string | number | null | undefined;
  color?: string;
  onComplete?: () => void;
}

const CountDown: FC<CountDownrops> = ({
  date,
  color = "var(--timer-color)",
  className,
  onComplete,
}) => {
  return (
    <p className={className} style={{ color: color }}>
      <Countdown
        date={date}
        renderer={renderer}
        zeroPadTime={2}
        zeroPadDays={2}
        onComplete={() => {
          if (onComplete) {
            onComplete();
          }
        }}
      />
    </p>
  );
};

export default CountDown;
