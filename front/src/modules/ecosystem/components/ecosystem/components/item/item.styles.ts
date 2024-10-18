import styled from "@emotion/styled";

export const ItemWrapper = styled.section<{
  background?: string;
  wide?: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #000;
  border-radius: 16px;
  background: ${props =>
    props.background ||
    "linear-gradient(275.42deg, #b78765 4.33%, #b7aa65 95.67%)"};

  .content,
  .button {
    position: relative;
    z-index: 1;
  }

  .button {
    width: 40px;
    height: 40px;
    margin-top: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0e1912;
    background: rgb(16 19 19 / 14%);
    border: none;
    border-radius: 50%;
    transition: background-color 0.3s;
  }

  &:hover .button {
    background: #9ef7aa;
  }

  &:active .button {
    background: #9ef7aa;
  }

  &:visited .button {
    background: #b5f8be;
  }

  &:focus .button {
    background: rgb(16 19 19 / 14%);
    outline: 1px solid var(--button-primary-hover-background-color);
    outline-offset: 1px;
  }

  &:focus-visible .button,
  .button:focus-visible {
    outline: 1px solid var(--button-primary-hover-background-color);
    outline-offset: 1px;
  }

  .decor {
    position: absolute;
    top: 70px;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    z-index: 0;
  }

  .soon {
    position: relative;
    margin-top: auto;
    z-index: 1;
  }

  &.active-link {
    cursor: pointer;
  }

  @media (min-width: 768px) {
    width: ${props =>
      props.wide ? "calc((100% - 12px) / 2)" : "calc((100% - 24px) / 3)"};
    min-height: 212px;
  }

  @media (min-width: 1024px) {
    padding: 16px;
    width: calc((100% - 48px) / 5);
    height: auto;
    min-height: 212px;
  }
`;
