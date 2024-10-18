import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const BlogStylesWrapper = styled.section`
  flex: 1;
  background-image: url("/images/background-other-m.png");
  background-repeat: repeat-y;
  background-size: cover;

  .tags-desctop {
    display: none;
  }

  @media (min-width: 768px) {
    background-image: url("/images/background-other.png");
    background-size: auto;
    background-position: 40% -60%;

    .tags-desctop {
      display: block;
    }

    .tags-mobile {
      display: none;
    }
  }
`;

export const BlogStylesPosts = styled(Box)`
  min-height: 80px;
  position: relative;
  grid-area: posts;
`;

export const BlogStylesTags = styled(Box)`
  grid-area: tags;

  @media (min-width: 768px) {
    display: block;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const BlogStylesAuthors = styled(Box)`
  grid-area: authors;
`;

export const BlogStylesPostsWrapp = styled.section`
  display: grid;
  grid-template-areas:
    "tags"
    "posts"
    "authors";

  @media (min-width: 1024px) {
    grid-template-areas:
      "posts tags"
      "posts authors";
    grid-template-columns: 1fr 350px;
    grid-template-rows: auto 1fr;
    align-items: start;
    column-gap: 30px;
  }
`;

export const BlogStylesFooter = styled(Box)`
  display: flex;
  justify-content: center;
`;
