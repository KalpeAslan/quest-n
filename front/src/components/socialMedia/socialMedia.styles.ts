import styled from "@emotion/styled";

interface ISocialMediaStylesList {
  align: string;
}

export const SocialMediaStylesList = styled.ul<ISocialMediaStylesList>`
  margin: 0 -8px;
  padding: 0;
  flex-wrap: wrap;
  list-style: none;
  justify-content: ${props => props.align === "right" && "flex-end"};

  button {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--social-medial-color) !important;
    background: none;
    border: none;
    outline: none;
    border-radius: 6px;
    transition: background-color 0.3s;
    cursor: pointer;
  }

  button:hover,
  button:active {
    background-color: var(--social-medial-hover-background-color);
  }

  @media (min-width: 600px) {
    & .c-icon {
      padding: 2px;
    }
  }

  @media (max-width: 600px) {
    & .c-align-right {
      justify-content: flex-end;
    }
  }
`;
