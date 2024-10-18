import styled from "@emotion/styled";

export const HeroStylesHero = styled.div`
  position: relative;
  margin: 0 -16px;
  padding: 30px 20px 50px;
  max-width: 100vw;
  background: linear-gradient(
    55deg,
    rgb(0 87 255 / 54%) 35%,
    rgb(42 225 132 / 66%) 75%
  );
  overflow: hidden;
  z-index: 1;

  .hero-ellipses {
    position: absolute;
    top: -500px;
    right: -700px;
    z-index: -1;
  }

  .caption-header {
    margin-bottom: 10px;
    color: var(--color-w1);
    font-weight: 500;
    font-size: 32px;
    line-height: 36px;
    text-align: center;
    letter-spacing: -0.02em;
  }

  .caption-green {
    display: block;
    color: var(--color-gr2);
  }

  .sub-caption {
    margin-bottom: 18px;
    color: var(--color-w1);
    font-weight: 500;
    font-size: 18px;
    line-height: 29px;
    text-align: center;
  }

  .hero-image {
    width: 257px;
    height: 272px;
    margin: 0 auto;
    margin-bottom: 10px;
    display: block;
  }

  .event-caption {
    margin-bottom: 13px;
    margin-left: 10px;
    color: var(--color-w1);
    font-weight: 500;
    font-size: 12px;
    opacity: 0.5;
    line-height: 16px;
  }

  .event-count {
    margin-bottom: 7px;
    margin-left: 10px;
    color: var(--color-gr2);
    font-weight: 500;
    font-size: 12px;
    opacity: 0.5;
    line-height: 16px;
  }

  .progress-bar {
    width: 77.5%;
    height: 3px;
    margin-bottom: 37px;
    margin-left: 10px;
    background: var(--color-b22);
    opacity: 0.7;
    border-radius: 40px;
  }

  .progress {
    height: 3px;
    background: var(--color-gr8);
    box-shadow: 0 0 5px rgb(135 246 150 / 60%);
    border-radius: 40px;
  }

  .event-button {
    width: 100%;
  }

  @media screen and (min-width: 768px) {
    .hero {
      margin: 0 -24px;
    }
  }

  @media screen and (min-width: 1280px) {
    .hero {
      margin: 0 0 10px;
      border-radius: 16px;
      padding: 35px 441px 35px 50px;
    }

    .hero-ellipses {
      top: -600px;
      right: -900px;
    }

    .caption-header {
      font-size: 48px;
      line-height: 52px;
      text-align: left;
    }

    .caption-green {
      display: inline;
    }

    .sub-caption {
      margin-bottom: 27px;
      font-size: 18px;
      line-height: 33px;
      text-align: left;
    }

    .hero-image {
      position: absolute;
      top: 0;
      right: 15px;
      width: 514px;
      height: 544px;
      margin: 0;
    }

    .event-caption {
      margin-left: 0;
    }

    .event-count {
      margin-left: 0;
    }

    .progress-bar {
      width: 248px;
      margin-bottom: 30px;
      margin-left: 0;
    }

    .event-button {
      width: auto;
    }
  }
`;
