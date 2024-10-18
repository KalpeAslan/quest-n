import styled from "@emotion/styled";

export const Wrapper = styled.div`
  flex: 1;

  .wrapper {
    margin: 0 -16px;
  }

  .ellipse-1 {
    position: absolute;
    top: -800px;
    right: -1300px;
    z-index: -1;
  }

  .ellipse-2 {
    position: absolute;
    top: -200px;
    right: -1600px;
    z-index: -1;
  }

  @media screen and (min-width: 768px) {
    .wrapper {
      margin: 0 -24px;
    }
  }

  @media screen and (min-width: 1280px) {
    padding: 40px 58px 0 60px;

    .wrapper {
      margin: 0 0 70px;
      padding-top: 50px;
      padding-bottom: 60px;
      background: rgb(16 19 19 / 60%);
      border-radius: 16px;
      border: 1px solid rgb(250 250 250 / 10%);
    }

    .ellipse-1 {
      top: 20%;
      right: auto;
      left: -1300px;
    }

    .ellipse-2 {
      top: 37%;
      right: -1200px;
    }
  }
`;
