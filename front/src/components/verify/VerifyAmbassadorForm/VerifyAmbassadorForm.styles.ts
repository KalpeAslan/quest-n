import styled from "@emotion/styled";
import { CBreakpoints } from "@styles/variables";

export const VerifyAmbassadorFormStylesForm = styled.form`
  max-width: 420px;
  width: 100%;
  padding: 35px 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: linear-gradient(
    123deg,
    rgba(84, 126, 190, 0.05) 14.13%,
    rgba(81, 220, 94, 0.05) 85.37%
  );
  color: white;

  .submit-button {
    margin-top: 30px;
  }

  .selector {
    width: 100% !important;
    ul {
      width: 100%;
    }
  }
  .input {
    input {
      height: 55px;
      background: #101313;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 100%;

    .username {
      margin-top: 24px;
      margin-bottom: 30px;
    }
  }

  @media screen and (max-width: ${CBreakpoints.tablet}px) {
    max-width: 100%;
    margin-top: 50px;
    .input-wrapper {
      gap: 20px;
      flex-direction: row;

      .username {
        margin: 0;
      }
      .username,
      .method {
        width: 50%;
      }
    }
  }
  @media screen and (max-width: ${CBreakpoints.md}px) {
    max-width: 100%;
    margin-top: 50px;
    .input-wrapper {
      gap: 20px;
      flex-direction: column;

      .username,
      .method {
        width: 100%;
      }
    }
  }
`;
