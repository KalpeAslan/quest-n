import styled from "@emotion/styled";
import { Box, Menu } from "@mui/material";

export const Wrapper = styled(Box)`
  cursor: pointer;
  display: inline-flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  align-items: center;
  padding: 5px 7px;
  justify-content: center;

  .iconWrapper {
    //background: rgba(255, 255, 255, 0.1);
    //border-radius: 50%;
    //width: 44px;
    //height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    //position: relative;
  }

  .countWrapper {
    background: #d9d9d9;
    width: 14px;
    height: 14px;
    font-size: 9px;
    line-height: 9px;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: 50%;
  }
`;

export const StyledOffChainTaskTypeMenu = styled(Menu)`
  .MuiList-root {
    padding: 0 !important;
  }

  .MuiPaper-root {
    background: #1a1f1f !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px !important;
  }
  .MuiMenuItem-root {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &:last-of-type {
      border-bottom: none !important;
    }
  }
`;
