import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { css } from "@emotion/react";

export const Wrapper = styled(Box)<{ disabled: boolean }>`
  flex: 1;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ disabled }) => (disabled ? "#2F2D20" : "#f5d47a")};
  border-radius: 4px;

  ${({ disabled }) =>
    disabled &&
    css`
      color: #f5d47a;

      .footer > p {
        color: #f5d47a;
      }
    `}

  &.expired {
    background: rgba(255, 255, 255, 0.5);
  }

  .image {
    width: 16px;
    min-width: 16px;
    height: 16px;
    position: relative;
  }

  .image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  .footer {
    display: flex;
    align-items: center;
  }
`;
