import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)<{ scoreboardOpen: boolean }>`
  padding: 18px 10px 18px 15px;
  border-radius: ${props =>
    props.scoreboardOpen ? "40px 40px 0px 0px" : "100px"};
  background: linear-gradient(
    145deg,
    rgba(135, 246, 150, 0.15) 4.67%,
    rgba(71, 192, 88, 0.06) 98.09%
  );
  display: flex;
  align-items: center;
  justify-content: space-between;

  .participantsContainer {
    display: flex;
    align-items: center;
  }

  .tooltip {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
  }

  .scoreboardButton {
    padding: 0;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
  }
`;
