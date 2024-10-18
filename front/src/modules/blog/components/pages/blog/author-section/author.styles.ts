// Wrapper Component
import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const AuthorSectionStylesWrapper = styled.section`
  padding: 16px;
  background-color: #222727;
  border-radius: 16px;
`;

// Author Component
export const AuthorSectionStylesAuthor = styled.header`
  margin-bottom: 12px;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #2d3232;
  text-decoration: none;
  z-index: 2;
`;

export const AuthorSectionStylesAuthorImage = styled(Box)`
  width: 80px;
  height: 80px;
  min-width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #171c1c;
  border-radius: 50%;
  overflow: hidden;

  & img {
    border-radius: 50%;
  }
`;

export const AuthorSectionStylesAuthorText = styled.div`
  max-width: 50px;
`;

// Item Component
export const AuthorSectionStylesItem = styled.div`
  margin-bottom: 16px;
  display: block;
  text-decoration: none;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }
`;

// Link Component
export const AuthorSectionStylesLink = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;

  & svg {
    margin-left: 10px;
  }
`;

// Content Component
export const AuthorSectionStylesContent = styled(Box)`
  padding-bottom: 16px;
  border-bottom: 1px solid #2d3232;

  a {
    text-decoration: none;
  }
`;
