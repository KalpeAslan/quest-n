import styled from "@emotion/styled";

export const Wrapper = styled.section`
  position: relative;
  height: 40px;
  margin: 0 -16px 0 -10px;

  .items {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    list-style: none;
  }

  .item-text {
    white-space: nowrap;
    margin-right: 4px;
  }

  .button,
  .button-clear {
    padding: 6px 9px !important;
    border-radius: 16px !important;
  }

  .button:last-child {
    margin-right: 16px;
  }

  .button-content {
    display: flex;
    align-items: center;
  }
`;
