import styled from "@emotion/styled";

export const FormWrapper = styled.div`
  max-width: 328px;

  .button-twitter svg {
    color: var(--tasks-twitter-icon-color);
  }

  .button-discord svg {
    color: var(--tasks-discord-icon-color);
  }

  .button-google svg {
    color: var(--tasks-google-icon-color);
  }

  .soc {
    flex: 1;
    padding: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 10px;
  }

  .butt {
    width: 100%;
  }
`;
