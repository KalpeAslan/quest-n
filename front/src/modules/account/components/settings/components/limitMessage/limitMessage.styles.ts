import styled from "@emotion/styled";

export const LimitMessageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .icon-wrapper {
    width: 100%;
    max-width: 328px;
    display: flex;
    justify-content: center;
  }

  .soc {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fc5b3f;
    background-color: rgb(252 91 63 / 10%);
    border-radius: 50%;
  }

  .soc svg {
    z-index: 2;
  }
`;
