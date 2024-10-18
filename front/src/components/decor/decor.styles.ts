import styled from "@emotion/styled";

const DecorStylesWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 260px;
`;

const DecorStylesColor = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  margin: auto;
  display: flex;
  justify-content: center;
  background: linear-gradient(
    280.87deg,
    var(--decor-c1) 20.45%,
    var(--decor-c2) 41.25%,
    var(--decor-c3) 72.03%,
    var(--decor-c4) 94.43%
  );
  border-top-right-radius: 70px;
  border-top-left-radius: 70px;
  overflow: hidden;
  opacity: 0.6;
  filter: blur(35px);
`;

const DecorStylesIcon = styled.div`
  position: absolute;
  right: 0;
  bottom: -280px;
  left: 50%;
  margin: auto;
  transform: translateX(calc(-50% - 20px));
  display: flex;
  justify-content: center;
  width: 900px;
  height: 900px;

  .decorIcon {
    width: 900px !important;
    height: 900px !important;
  }

  @media (min-width: 768px) {
    bottom: -270px;
  }

  @media (min-width: 1024px) {
    bottom: -340px;
  }
`;

export { DecorStylesWrapper, DecorStylesColor, DecorStylesIcon };
