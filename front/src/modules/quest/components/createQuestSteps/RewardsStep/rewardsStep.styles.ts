import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { CBreakpoints } from "@styles/variables";

export const Wrapper = styled(Box)<{ verified?: boolean }>`
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 10px;
  position: relative;
  ${props => props.verified && "pointer-events: none"};

  .tooltip {
    width: 14px;
    height: 14px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(255 255 255 / 20%);
    border-radius: 50%;
  }

  .add-new-reward-button {
    max-width: 664px;
  }

  .icon {
    color: var(--sidebar-select-color);
    margin-left: 4px;
  }

  .icon.opened {
    transform: rotate(180deg);
  }

  .inputWrapper.p {
    input {
      padding-top: 13px !important;
      padding-bottom: 13px !important;
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

  .addRewardButton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
  }

  .addRewardIcon {
    margin-right: 10px;
  }

  .btnBack {
    margin-right: 32px;
    max-width: 120px;
  }

  .btnSave {
    max-width: 328px;
  }

  @media screen and (max-width: ${CBreakpoints.md}px) {
    .btnBack,
    .btnSave {
      max-width: 328px;
      flex: 1;
    }
  }
`;

export const RewardBadge = styled.div<{ selected: boolean }>`
  display: flex;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 16px;
  background: rgba(
    ${({ selected }) =>
      selected ? "135, 246, 150, 0.1" : "250, 250, 250, 0.10"}
  );
  cursor: pointer;
`;
