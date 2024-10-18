import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const AuthorStylesWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-image: url("/images/background-other-m.png");
  background-repeat: repeat-y;
  background-size: cover;
`;

export const AuthorStylesHeader = styled(Box)`
  grid-area: header;
`;

export const AuthorStylesSticky = styled(Box)`
  grid-area: sticky;
`;

export const AuthorStylesFooter = styled.div`
  position: relative;
  grid-area: footer;
`;

export const AuthorStylesContainer = styled(Box)`
  flex: 1;
  width: 100%;
  padding: 0 16px;
  display: grid;
  grid-template-areas:
    "breadcrumbs"
    "sticky"
    "header"
    "footer";

  @media (min-width: 768px) {
    padding: 0 24px;
    grid-template-areas:
      "breadcrumbs"
      "header"
      "sticky"
      "footer";
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-areas:
      "breadcrumbs breadcrumbs"
      "header header"
      "footer sticky";
    column-gap: 30px;
    grid-template-columns: 3fr 350px;
    grid-template-rows: auto auto 1fr;
  }

  @media (min-width: 1280px) {
    max-width: 1180px;
    margin-right: auto;
    margin-left: auto;
  }

  @media (min-width: 1440px) {
    padding: 0 55px;
  }
`;

export const AuthorStylesFooterMore = styled(Box)`
  display: flex;
  justify-content: center;
`;
