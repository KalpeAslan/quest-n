import styled from "@emotion/styled";
import Link from "next/link";
import { css } from "@emotion/react";

export const BreadcrumbsStyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

const LinkStyles = css`
  display: flex;
  align-items: center;
  color: #999;
  text-decoration: none;
  transition: color 0.3s;
  border-radius: 4px;

  svg {
    margin-left: 12px;
  }

  &.active:hover {
    color: #87f696;
  }

  &.active:active {
    color: #b5f8be;
  }

  &.active:visited {
    background: #87f696;
  }

  &.active:focus {
    outline: 1px solid rgb(135 246 150 / 20%);
    outline-offset: "1px";
  }

  &.active:focus-visible {
    outline: 1px solid rgb(135 246 150 / 20%);
    outline-offset: "1px";
  }

  &.active:disabled {
    color: "#2d3232";
    cursor: "not-allowed";
  }
`;

export const BreadcrumbsStyledLink = styled(Link)`
  ${LinkStyles}
`;
export const BreadcrumbsStyledLinkP = styled.p`
  ${LinkStyles}
`;
