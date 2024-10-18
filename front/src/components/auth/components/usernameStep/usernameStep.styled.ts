import { TSocialAuthType } from "@/modules/account/models";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)<{
  entryType: TSocialAuthType | "phone" | "email" | null;
}>`
  max-width: 328px;
  margin: 0 auto;

  .iconWrapper {
    margin: 0 auto;
    margin-bottom: 20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(135, 246, 150, 0.1);
  }

  .userLabel {
    border-radius: 10px;
    border: 1px solid #292929;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;

    svg {
      color: ${props => `var(--tasks-${props.entryType}-icon-color)`};
    }
  }

  .input {
    position: relative;
    margin-bottom: 36px;
  }

  .error {
    text-align: left;
    position: absolute;
    bottom: 0;
    transform: translateY(calc(100% + 4px));
  }

  .helper {
    color: rgba(255, 255, 255, 0.3);
  }

  .submitBtn {
    margin-bottom: 20px;
  }
`;
