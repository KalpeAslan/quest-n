import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)<{ open?: boolean }>`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
  ${props => props.open && "background: rgba(255, 255, 255, 0.03);"}
  position: relative;

  &.done {
    opacity: 0.5;
  }

  .iconWrapper {
    min-width: 36px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .openIcon {
    color: #fafafa;
    margin-left: 4px;
    transform: rotate(180deg);
  }

  .divider {
    background: rgba(255, 255, 255, 0.1);
    width: 100%;
    height: 1px;
  }

  .error, .warning {
    position: absolute;
    top: -10px;
    left: 0;
    padding: 4px 6px 4px 6px;
    display: flex;
    background: #fc5b3f;
    border-radius: 29px;
    color: var(--text-color-2) !important;
  }

  .warning {
    background: var(--button-primary-disabled-background-color);
  }
  .buttonContent {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
    width: 100%;
    color: #fafafa !important;

    &.twitter {
      svg {
        color: #1da1f2 !important;
      }
    }

    .icon {
      margin-right: 8px;
    }
  }
`;
