import styled from "@emotion/styled";

export const WYSIWYGStyles = styled.div<{
  error: boolean;
  minHeight: number;
  isDisabled?: boolean;
}>`
  position: relative;
  pointer-events: ${props => (props.isDisabled ? "none" : "all")};

  .quill {
    .ql-toolbar.ql-snow {
      border-color: ${({ error }) =>
        error
          ? "var(--input-primary-error-color)"
          : "var(--input-primary-border-color)"};
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      .ql-formats {
        margin-right: 0;
        button {
          border: 1px solid var(--input-primary-border-color);
          border-radius: 5px;
          margin-right: 5px;
        }
        .ql-stroke {
          stroke: #cecece !important;
        }
        .ql-active {
          border: 1px solid var(--color-gr2) !important;

          .ql-stroke {
            stroke: var(--color-gr2) !important;
          }
        }
      }
    }

    .ql-container.ql-snow {
      min-height: ${props => props.minHeight}px;
      border-color: ${({ error }) =>
        error
          ? "var(--input-primary-error-color)"
          : "var(--input-primary-border-color)"};
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;

      .ql-tooltip {
        background: var(--color-b0) !important;
        box-shadow: 0 2px 6px var(--wallets-popup-box-shadow) !important;
        border-color: var(--input-primary-border-color) !important;

        input {
          color: var(--input-primary-text-color);
          background-color: transparent;
          border: none;
          //border: 1px solid var(--input-primary-border-color);
          font-family: var(--font-family-1);
          font-size: 16px;
          line-height: 22px;
          //border-radius: 10px;
          outline: none;
        }
        .ql-action {
          color: var(--input-primary-text-color);
        }
      }
      .ql-editor {
        min-height: 135px;
        p {
          font-size: 14px;
          font-family: var(--font-family-1);
        }

        a {
          color: var(--color-gr2);
        }

        &::before {
          font-family: var(--font-family-1);
          font-style: normal !important;
          font-size: 16px;
          font-weight: 400;
          line-height: 22px;
          letter-spacing: 0;
          text-align: left;
          color: rgba(255, 255, 255, 0.3) !important;
        }
      }
    }
  }
`;
