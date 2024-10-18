import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const HeaderWrapper = styled.header`
  .show-more-btn {
    margin: 16px -8px;
    justify-content: flex-start;
  }

  .show-more-btn.opened {
    margin-top: 0;
  }

  .short-description {
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const HeaderStyled = styled(Box)<{
  preview: boolean;
  fullPreview: boolean;
}>`
  display: flex;
  flex-direction: ${({ preview }) =>
    preview ? "column-reverse !important" : "column"};
  align-items: flex-start;

  .partners {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .time {
    margin: 16px 0;
    padding: 4px 10px;
    display: flex;
    align-items: center;
    background: ${({ fullPreview, preview }) =>
      preview && !fullPreview ? "transparent" : "rgb(255 255 255 / 5%)"});
    border-radius: 4px;
    width: ${({ fullPreview, preview }) =>
      preview && !fullPreview ? "100%" : "auto"};
    justify-content: ${({ fullPreview, preview }) =>
      preview && !fullPreview && "space-between"};
  }

  .time-text {
    text-transform: uppercase;
  }

  ${({ preview }) =>
    !preview &&
    `@media screen and (min-width: 485px) {
    flex-direction: row;

    .time {
      margin: 5px 0 0 auto;
    }
  }`}
`;
