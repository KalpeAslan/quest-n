import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { Button } from "@components/UI/button";

export const ShowMoreStylesHeader = styled.header`
  display: flex;
  justify-content: center;
`;

export const ShowMoreStylesContent = styled(Box)<{ preview: boolean }>`
  position: relative;
  overflow: hidden;
  transition: height 0.3s;
  ${({ preview }) =>
    preview &&
    `
    white-space: pre-wrap;
    max-width: 100%;
    word-break: break-all;
    height: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    display: -webkit-box;
  `}
`;

export const ShowMoreStylesButton = styled(props => <Button {...props} />)`
  display: flex;
  align-items: center;
  color: #fafafa !important;
  font-weight: 400 !important;
  font-size: 12px !important;
  line-height: 16px !important;

  &:focus-visible {
    outline: 2px solid #fafafa !important;
  }

  &:hover,
  &:active,
  &:focus {
    text-decoration: none !important;
  }

  & svg {
    margin: 2px 0 0 4px;
  }
` as any;
