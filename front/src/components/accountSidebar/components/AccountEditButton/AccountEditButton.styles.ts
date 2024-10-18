import styled from "@emotion/styled";

export const AccountEditButtonStylesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px 20px 20px 30px;
  padding: 5px 9px 5px 3px;

  & .avatar-wrapper {
    width: 35px;
    height: 35px;
    border-radius: 56px;
    border: 1px solid #444;
    margin-right: 7px;
    position: relative;

    img {
      width: 100%;
      height: 100%;
    }
  }

  & .pencil-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: var(--color-b11);
    border-radius: 50%;
    cursor: pointer;
  }
`;
