import styled from "@emotion/styled";

export const AuthorsStylesWrapper = styled.section`
  flex: 1;
  flex-direction: column;
  background-image: url("/images/background-other-m.png");
  background-repeat: repeat-y;
  background-size: cover;

  @media (min-width: 768px) {
    background-image: url("/images/background-other.png");
    background-position: 65% -45%;
    background-size: auto;
  }
`;
