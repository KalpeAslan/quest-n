import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const FilterWrapper = styled(Box)<{ preview?: boolean }>`
  position: relative;
  height: 40px;
  pointer-events: ${props => (props.preview ? "none" : "initial")};

  .filter-content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .filter {
    margin: 0;
    padding: 2px 0 0 2px;
    display: flex;
    align-items: center;
    gap: 8px;
    list-style: none;
  }

  .filter li {
    padding-bottom: 12px;
  }

  .filter-item {
    padding: 4px 10px;
    color: var(--filter-item-text-color);
    background-color: var(--filter-item-background-color);
    border: none;
    border-radius: 24px;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
  }

  .filter-item:focus-visible {
    outline: 2px solid var(--button-primary-hover-background-color);
    outline-offset: "2px";
  }

  .filter-item-active {
    color: var(--filter-active-item-text-color);
    background-color: var(--filter-active-item-background-color);
    cursor: initial;
  }
`;
