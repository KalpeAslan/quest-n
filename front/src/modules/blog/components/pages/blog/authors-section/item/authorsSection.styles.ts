import styled from "@emotion/styled";
import { Box } from "@mui/material";

// Author Section Item
const AuthorsSectionItem = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;
  z-index: 2;
`;

// Author Image
const AuthorsSectionItemImg = styled(Box)`
  width: 48px;
  height: 48px;
  min-width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #222727;
  background-color: #171c1c;
  border-radius: 50%;
  overflow: hidden;

  img {
    border-radius: 50%;
    object-fit: cover;
  }
`;

// Author Text
const AuthorsSectionItemText = styled.p`
  max-width: 50px;
`;

export { AuthorsSectionItem, AuthorsSectionItemImg, AuthorsSectionItemText };
