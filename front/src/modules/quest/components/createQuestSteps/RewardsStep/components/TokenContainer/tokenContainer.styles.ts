import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { CBreakpoints } from "@styles/variables";

export const Wrapper = styled(Box)`
  .inputWrapper.p {
    input {
      padding-top: 13px !important;
      padding-bottom: 13px !important;
    }

    input:disabled {
      opacity: 0.3;
    }
  }

  .inputWrapper.p2 {
    input {
      padding-top: 14px !important;
      padding-bottom: 14px !important;
    }

    input:disabled {
      opacity: 0.3;
    }
  }

  .inputWrapper:not(:last-child) {
    margin-bottom: 16px;
  }

  .deleteButton {
    width: 50px;
    height: 50px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .deleteMobileButton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    margin-right: 16px;
  }

  .addRewardButton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
  }

  .btnIcon {
    margin-right: 10px;
  }

  .desktop {
    display: none;
  }

  @media screen and (min-width: 768px) {
    padding: 0;
    .deleteMobileButton {
      display: none;
    }

    .desktop {
      display: flex;
    }

    .mobile {
      display: none;
    }
  }

  @media screen and (max-width: ${CBreakpoints.md}px) {
    .addRewardButton,
    .deleteMobileButton {
      flex: 1;
      justify-content: center;
    }
  }
`;
