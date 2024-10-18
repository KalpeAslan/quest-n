import styled from "@emotion/styled";
import Button from "@components/UI/button/Button";

export const BadgesStyles = {
  token: styled.div`
    height: 28px;
    display: flex;
    padding: 5px 7px;
    justify-content: center;
    align-items: center;
    gap: 2px;
    border-radius: 6px;
    background: linear-gradient(180deg, #87f696 0%, #47c058 100%);
    box-shadow: 0px 0px 14px 0px rgba(135, 246, 150, 0.1);

    svg {
      position: relative;
      top: -1px;
      margin-right: 5px;
    }
  `,
  reward: styled(Button)`
    height: 28px !important;
    border-radius: 6px !important;
    padding: 5px 7px !important;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      margin-right: 5px;
    }
  `,
};
