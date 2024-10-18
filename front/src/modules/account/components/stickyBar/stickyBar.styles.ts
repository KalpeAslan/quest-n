import styled from "@emotion/styled";
import launchM from "@assets/images/home-page/launch-m.webp";
import launchM2x from "@assets/images/home-page/launch-m-2x.webp";

export const StickyBarWrapper = styled.div`
  padding: 16px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 16px;
  text-align: center;
  overflow: hidden;

  & .content {
    position: relative;
    display: grid;
    grid-template-areas:
      "title"
      "text";
    gap: 20px;
    z-index: 1;
  }

  &.active .content {
    position: relative;
    display: grid;
    grid-template-areas:
      "title"
      "text"
      "form"
      "button"
      "share";
    gap: 20px;
    z-index: 1;
  }

  .share {
    grid-area: share;
    text-align: left;
  }

  .title {
    grid-area: title;
  }

  .text {
    grid-area: text;
  }

  .form-group {
    grid-area: form;
  }

  .form {
    max-width: 100% !important;
  }

  .button {
    grid-area: button;
  }

  .link {
    padding: 0;
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
    text-decoration: none;
  }

  .link:hover {
    text-decoration: underline;
  }

  .link:focus-visible {
    outline: none;
    text-decoration: underline;
  }

  .btn {
    width: 100%;
  }

  .image {
    display: none;
  }

  .decor {
    width: 100%;
    height: 227px;
    margin-top: -50px;
    background-image: url(${launchM2x.src});
    background-image: -webkit-image-set(
      url(${launchM.src}) 1x,
      url(${launchM2x.src}) 2x
    );
    background-image: image-set(
      url(${launchM.src}) 1x,
      url(${launchM2x.src}) 2x
    );
    background-repeat: no-repeat;
    background-position: bottom -24px right -140px;
    background-size: contain;
  }

  @media screen and (min-width: 768px) {
    &.active .content {
      position: relative;
      display: grid;
      grid-template-areas:
        "title title"
        "text text"
        "form form"
        "share button";
      grid-template-columns: 1fr 1fr;
      align-items: flex-end;
      gap: 20px;
      z-index: 1;
    }

    .form {
      flex-direction: row !important;
    }

    .form > div {
      width: 50%;
    }
  }

  @media screen and (min-width: 1024px) {
    text-align: left;

    &.active .content {
      position: relative;
      display: grid;
      grid-template-areas:
        "title"
        "button"
        "form"
        "text"
        "share";
      grid-template-columns: 1fr;
      gap: 20px;
      z-index: 1;
    }

    .form {
      flex-direction: column !important;
    }

    .form > div {
      width: 100%;
    }

    .image {
      height: 153px;
      margin: 0 -16px -16px;
      padding: 0;
      display: block;
      opacity: 0.6;
    }

    .title {
      max-width: 245px;
    }

    .text {
      max-width: 255px;
    }
  }
`;
