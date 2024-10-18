import styled from "@emotion/styled";

export const UserWrapper = styled.section`
  flex: 1;
  display: flex;
  align-items: center;

  .image {
    width: 56px;
    min-width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .editWrapper {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #272a2a;
    border-radius: 50%;
    min-width: 40px;
    cursor: pointer;
  }
`;
