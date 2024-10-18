import styled from "@emotion/styled";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const ModalStyled = styled.section`
  width: 100vw;
  max-width: 288px;
  padding: 20px 16px;
  background-color: #131616;
  border-radius: 16px;

  .header {
    margin-bottom: 20px;
    padding-bottom: 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #2d3232;
  }

  .icon {
    padding: 0;
    display: flex;
    align-items: center;
    color: inherit;
    background-color: transparent;
    border: none;
    font: inherit;
    cursor: pointer;
  }

  .icon > span {
    margin-left: 12px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
`;
