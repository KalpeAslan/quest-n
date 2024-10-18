import React, { ReactNode, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  default as CTooltip,
  TooltipProps,
  tooltipClasses,
} from "@mui/material/Tooltip";
import { ClickAwayListener, Theme, useMediaQuery } from "@mui/material";
import { CBreakpoints } from "@styles/variables";

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => {
  const isSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.md),
  );
  return (
    <CTooltip
      {...props}
      {...(isSm
        ? {
            enterTouchDelay: 0,
            leaveTouchDelay: 1000,
          }
        : {})}
      arrow={props.arrow}
      classes={{ popper: className }}
    />
  );
})(() => ({
  whiteSpace: "break-spaces",
  [`& .${tooltipClasses.arrow}`]: {
    position: "relative",
    color: "var(--tooltip-border-color)",

    "&:after": {
      position: "absolute",
      top: "0px",
      left: "1px",
      margin: "auto",
      content: '""',
      border: "6px solid transparent",
      borderTop: "6px solid var(--tooltip-background-color)",
    },
  },

  [`& .${tooltipClasses.tooltip}`]: {
    border: "1px solid var(--tooltip-border-color)",
    backgroundColor: "var(--tooltip-background-color)",
    color: "var(--tooltip-text-color)",
    fontSize: "14px",
    lineHeight: "20px",
  },
}));

type Props = {
  value: string | ReactNode;
  placement?:
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
  arrow?: boolean;
  className?: string;
  children: React.ReactElement<any, any>;
  followCursor?: boolean;
  hide?: boolean;
};

const Tooltip = ({
  value,
  placement,
  arrow,
  className,
  children,
  followCursor,
  hide,
}: Props) => {
  const isSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.sm),
  );
  const [tooltipState, setTooltipState] = useState(false);

  const clickProps = {
    disableFocusListener: true,
    disableHoverListener: true,
    disableTouchListener: true,
    PopperProps: {
      disablePortal: true,
    },
    open: value,
    onClose: () => setTooltipState(false),
  };

  const renderContent = () => {
    if (!isSm)
      return (
        <StyledTooltip
          className={className}
          title={value}
          arrow={arrow}
          placement={placement}
          followCursor={followCursor}
        >
          {children}
        </StyledTooltip>
      );

    return (
      <ClickAwayListener onClickAway={() => setTooltipState(false)}>
        <div>
          <StyledTooltip
            className={className}
            title={value}
            arrow={arrow}
            placement={placement}
            followCursor={followCursor}
            {...(isSm ? clickProps : {})}
            open={tooltipState}
            onClick={() => setTooltipState(true)}
          >
            {children}
          </StyledTooltip>
        </div>
      </ClickAwayListener>
    );
  };

  return hide ? (
    children
  ) : (
    <StyledTooltip
      className={className}
      title={value}
      arrow={arrow}
      placement={placement}
      followCursor={followCursor}
    >
      {renderContent()}
    </StyledTooltip>
  );
};

export default Tooltip;
