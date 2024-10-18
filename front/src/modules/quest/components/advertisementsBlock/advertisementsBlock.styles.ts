import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  background: #172123;
  border-radius: 16px;
  width: calc(100% - 32px);
  overflow: hidden;
  margin: 30px auto;

  .item {
    display: flex;
    padding-top: 9px;
    padding-bottom: 9px;
    padding-left: 12px;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }
  }

  .titleBlock {
    display: flex;
    align-items: center;
  }

  .icon {
    margin-right: 5px;
  }

  .title {
    white-space: nowrap;
  }

  .tooltip {
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d7d7d7;
    margin-left: 5px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .adItem {
    padding-left: 7px;
    display: flex;
    align-items: center;
    justify-content: center;

    a {
      text-decoration: none;
      color: var(--text-color-2);
    }

    &.highlighted,
    &.highlighted a {
      color: #f5d47a;
    }
  }

  .divider {
    width: 1px;
    height: 15px;
    background: #87f696;
    margin-left: 7px;
  }

  @media screen and (min-width: 768px) {
    margin: 40px auto 55px;
    width: 100%;
  }
`;
