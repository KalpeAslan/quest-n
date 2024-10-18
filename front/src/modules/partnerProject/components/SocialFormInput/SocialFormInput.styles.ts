import styled from "@emotion/styled";

export const SocialFormInputStylesWrapper = styled.div`
  position: relative;
  .partner-project-social-form-input {
    &__icon {
      text-align: right;
      margin-right: 15px;
      max-height: 24px;
    }
    &__close-button {
      max-height: 48px !important;
      margin-left: 16px;
    }
  }
`;

export const SocialFormStylesContainer = styled.div<{ iconName: string }>`
  border: 1px solid var("--input-primary-border-color");
  border-radius: 10px;
  padding: 12px;
  background: transparent;
  max-width: 328px;
  width: 100%;

  svg {
    color: ${({ iconName }) => {
      switch (iconName) {
        case "twitter":
          return "var(--tasks-twitter-icon-color)";
        case "telegram":
          return "var(--tasks-telegram-icon-color)";
        case "discord":
          return "var(--tasks-discord-icon-color)";
      }
    }};
  }
`;

export const SocialFormInputStyles = styled.div`
  width: auto;
  background: transparent;
  color: #fafafa;
  font-family: var(--font-family-1);
  border: none;
  outline: none;
  margin: 0;
  box-sizing: border-box;
  text-align: left;
`;
