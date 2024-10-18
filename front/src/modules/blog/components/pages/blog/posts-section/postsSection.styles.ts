import styled from "@emotion/styled";

export const PostsSectionStylesList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 1024px) {
    gap: 0;

    li {
      margin-bottom: 25px;
      padding-bottom: 25px;
      border-bottom: 1px solid #272a2a;
    }

    li:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
  }
`;
