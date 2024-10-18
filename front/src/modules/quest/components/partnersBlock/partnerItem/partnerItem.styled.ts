import styled from "@emotion/styled";

export const Wrapper = styled.a`
  display: flex;
  text-decoration: none;
  align-items: center;
  gap: 10px;

  .logoWrapper {
    position: relative;
    height: 47px;
    width: 85px;
    overflow: hidden;
    img {
      width: 90px;
      height: 90px;
    }
  }

  .logo {
    height: 94px !important;
    width: auto !important;
    transform: translateY(-47px);
  }

  &:hover .logo {
    transform: translateY(0);
  }

  .divider {
    width: 1px;
    height: 25px;
    background: rgba(255, 255, 255, 0.5);
    margin-left: 10px;
    margin-right: 10px;
  }
`;
