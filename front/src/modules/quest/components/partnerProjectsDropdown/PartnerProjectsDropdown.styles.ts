import styled from "@emotion/styled";

export const PartnerProjectsDropdownStyles = {
  Wrapper: styled.div`
    width: 100%;

    .partner-projects-dropdown-enter {
      opacity: 0;
      transform: translateY(-100%);
    }
    .partner-projects-dropdown-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 500ms, transform 500ms;
    }
    .partner-projects-dropdown-exit {
      opacity: 1;
    }
    .partner-projects-dropdown-exit-active {
      opacity: 0;
      transform: translateY(-50%);
      transition: opacity 500ms, transform 500ms;
    }
  `,
};
