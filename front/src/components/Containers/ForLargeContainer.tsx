import { FC, ReactNode } from "react";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { CBreakpoints } from "@styles/variables";

interface IProps {
  children: ReactNode;
}

export const ForLargeContainer: FC<IProps> = ({ children }) => {
  const isUpExtraLg = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(CBreakpoints.extraLg),
  );
  return isUpExtraLg ? (
    <Box
      className={"background-other"}
      width={"100%"}
      style={{
        display: "flex !important",
        justifyContent: "center !important",
        alignItems: "center",
      }}
    >
      <Box
        sx={theme => ({
          [theme.breakpoints.up(CBreakpoints.extraLg)]: {
            maxWidth: CBreakpoints.xLg,
          },
        })}
      >
        {children}
      </Box>
    </Box>
  ) : (
    <div className={"background-other"}>{children}</div>
  );
};
