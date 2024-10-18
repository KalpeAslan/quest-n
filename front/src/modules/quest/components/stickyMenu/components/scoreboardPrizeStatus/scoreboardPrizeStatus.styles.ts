import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  padding: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background: var(--color-b25);
  text-align: center;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;

  p {
    text-align: center;
  }

  &.shadow {
    border: 1px solid #87f696;
    box-shadow: 0px 4px 44px 0px rgba(135, 246, 150, 0.3);
  }

  .rewards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 5px;
  }

  .rewardItem {
    padding: 5px 7px;
    border-radius: 6px;
    background: linear-gradient(180deg, #87f696 0%, #47c058 100%);
    margin-bottom: 10px;
    color: #141414;
    font-weight: 500;

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
`;
