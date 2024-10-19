import styled from "@emotion/styled";
import { Box } from "@mui/material";

// Authors Styles Wrapper
const AuthorsStylesWrapper = styled.section`
  padding: 16px;
  background-color: #222727;
  border-radius: 16px;
`;

// Authors Styles List
const AuthorsStylesList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

// Authors Styles Item
const AuthorsStylesItem = styled.li`
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #2d3232;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

// Authors Styles NavFooter
const AuthorsStylesFooter = styled(Box)`
  padding-top: 12px;
  border-top: 1px solid #2d3232;

  a {
    text-decoration: none;
  }
`;

// Authors Styles Link
const AuthorsStylesLink = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;

  svg {
    margin-left: 10px;
  }
`;

export {
  AuthorsStylesWrapper,
  AuthorsStylesList,
  AuthorsStylesItem,
  AuthorsStylesFooter,
  AuthorsStylesLink,
};
