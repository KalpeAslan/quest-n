import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { CBreakpoints } from "@styles/variables";

export const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  .inputWrapper {
    margin-bottom: 28px;
  }

  .inputWrapper.date {
    max-width: 225px;
  }

  .input {
    position: relative;
    color-scheme: dark;
  }

  .error {
    text-align: left;
    position: absolute;
    bottom: 0;
    transform: translateY(calc(100% + 4px));
  }

  .btn {
    max-width: 328px;
  }

  .divider {
    display: block;
    width: 1px;
    height: auto;
    max-height: 650px;
    background: rgba(255, 255, 255, 0.1);
  }

  .previewImageWrapper {
    display: flex;
    align-items: start;
    flex-direction: column;
    gap: 30px;
  }

  .imageWrapper {
    position: relative;
    width: 350px;
    min-width: 350px;
    height: 250px;
    max-height: 250px;
    margin-bottom: 20px;
  }

  .image {
    border-radius: 16px;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  .uploadButton {
    padding: 13px 24px 13px 24px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--button-secondary-text-color);
    background: var(--button-secondary-background-color);
    backdrop-filter: blur(10px);
    min-width: auto !important;
    white-space: nowrap;

    font-family: var(--font-family-1);
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    border-radius: 10px;
    border: 1px solid;
    border-color: transparent;
    outline: none;
    cursor: pointer;
    transition: background-color 0.3s, border 0.3s, color 0.3s;
    &:hover {
      background: var(--button-secondary-hover-background-color);
    }
    &:active {
      background: var(--button-secondary-hover-background-color);
    }
    &:visited {
      background: var(--button-secondary-pressed-background-color);
    }
    &:focus {
      background: var(--button-secondary-focus-background-color);
    }
    &:focus-visible {
      outline: 2px solid var(--button-primary-hover-background-color);
      outline-offset: 2px;
    }
    &.disabled {
      background: var(--button-secondary-disabled-background-color);
      cursor: not-allowed;
    }
  }

  .uploadInput {
    display: none;
  }

  .deleteButton {
    padding: 13px 24px 13px 24px;
    display: flex;
    font-weight: 500;
    align-items: center;
    justify-content: center;
    margin-left: 15px;
    flex-grow: 1;
  }

  @media screen and (max-width: ${CBreakpoints.xSm}px) {
    .imageWrapper {
      width: 100%;
      min-width: 100%;
    }
  }

  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .datesWrapper {
      display: flex;
    }

    .inputWrapper.date {
      width: calc((100% - 24px) / 2);
      max-width: none;
    }

    .formWrapper {
      flex-grow: 1;
      //max-width: calc(100% - 391px);
    }
    .previewImageWrapper {
      flex-direction: row;
    }

    //.previewImageWrapper {
    //  flex-grow: 1;
    //  max-width: 350px;
    //}
  }
`;

export const QuestTypeItem = styled(Box)<{ selected: boolean }>`
  padding: 16px;
  background: ${props =>
    props.selected ? "rgba(135, 246, 150, 0.1)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 10px;
  display: flex;
  cursor: pointer;

  .radio {
    margin-right: 16px;
    background: #101313;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    width: 24px;
    min-width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .radioSelected {
    background: #87f696;
    border-radius: 50%;
    width: 12px;
    height: 12px;
  }
`;
