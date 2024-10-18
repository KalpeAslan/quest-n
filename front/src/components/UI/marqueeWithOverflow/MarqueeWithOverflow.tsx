import { useIsOverflow } from "@/hooks/useIsOverfow";
import { Box } from "@mui/material";
import { FC, useRef } from "react";
import Marquee from "react-fast-marquee";

interface Props {
  children: any;
  autoFill?: boolean;
  pauseOnHover?: boolean;
  speed?: number;
  callback?: (isOverflow: boolean) => void;
}

const MarqueeWithOverflow: FC<Props> = ({
  autoFill,
  pauseOnHover,
  children,
  speed,
  callback,
}) => {
  const ref = useRef();

  const isOverflow = useIsOverflow({ ref, callback });

  return (
    <>
      {isOverflow ? (
        <Marquee autoFill={autoFill} pauseOnHover={pauseOnHover} speed={speed}>
          {children}
        </Marquee>
      ) : (
        <Box width="100%" overflow="auto" ref={ref}>
          <Box display="flex">{children}</Box>
        </Box>
      )}
    </>
  );
};

export default MarqueeWithOverflow;
