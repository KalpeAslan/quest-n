import styled from "@emotion/styled";

export const Wrapper = styled.div`
  .markdown h1 {
    font-weight: 500;
    font-size: 48px;
    font-style: normal;
    line-height: 56px;
    letter-spacing: -0.02em;
  }

  .markdown h2 {
    font-weight: 500;
    font-size: 20px;
    font-style: normal;
    line-height: 24px;
  }

  .markdown h3 {
    font-weight: 500;
    font-size: 20px;
    font-style: normal;
    line-height: 24px;
  }

  .markdown h4 {
    font-weight: 500;
    font-size: 18px;
    font-style: normal;
    line-height: 24px;
  }

  .markdown h5 {
    font-weight: 500;
    font-size: 16px;
    font-style: normal;
    line-height: 22px;
  }

  .markdown h6 {
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 18px;
  }

  .markdown p {
    font-size: 14px;
    font-style: normal;
    line-height: 19px;
  }

  .markdown p.sub-title {
    font-size: 16px;
    font-style: normal;
    line-height: 22px;
  }

  .markdown em {
    font-weight: 400;
    font-size: 18px;
    font-style: italic;
    line-height: 24px;
  }

  .markdown blockquote {
    margin: 54px;
    padding: 8px 16px;
    background-color: var(--markdown-blockquote-background-color);
  }

  .markdown ul,
  .markdown ol {
    padding-left: 20px;
  }

  .markdown .soc ul,
  .markdown .soc ol {
    padding-left: 10px;
  }

  .markdown a {
    color: var(--markdown-link-color);
    text-decoration: none;
  }

  .markdown a:hover,
  .markdown a:focus,
  .markdown a:active {
    text-decoration: underline;
  }

  .markdown img {
    margin: 0 auto;
    max-height: 450px;
    max-width: 100%;
    display: block;
    border-radius: 12px;
    overflow: hidden;
    min-height: 80px;
    width: auto;
    height: auto;
  }

  .profile-content {
    margin-top: 20px;
  }

  .markdown p.profile-title,
  .markdown p.profile-position,
  .markdown p.profile-text {
    font-size: 16px;
  }

  .markdown p.profile-title {
    font-weight: 700;
  }

  .markdown p.profile-position {
    color: var(--project-partners-subtitle);
  }

  .markdown .points-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: 25px;
  }

  .markdown .points {
    width: 100%;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .markdown .points-image {
    margin-bottom: 24px;
  }

  .markdown .points-image img {
    max-width: 60px;
    max-height: 60px;
    display: block;
    object-fit: contain;
  }

  .markdown .points-title {
    margin-bottom: 8px;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
  }

  .markdown .points-text {
    font-size: 14px;
    line-height: 20px;
  }

  .profile-image img {
    width: 100%;
    height: 100%;
    max-width: 170px;
    max-height: 200px;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  @media (min-width: 500px) {
    .profile {
      max-width: 802px;
      margin: auto;
      display: flex;
      align-items: center;
    }

    .profile-image {
      width: calc(50% - 24px);
      flex-shrink: 0;
      margin-right: 24px;
    }

    .profile-content {
      margin-top: 0;
    }
  }

  @media (min-width: 630px) {
    .markdown .points {
      width: calc(50% - 13px);
    }
  }

  @media (min-width: 768px) {
    .markdown h1 {
      font-size: 48px;
      line-height: 56px;
    }

    .markdown h2 {
      font-size: 32px;
      line-height: 38px;
    }

    .markdown h3 {
      font-size: 24px;
      line-height: 32px;
    }

    .markdown p {
      font-size: 16px;
      line-height: 22px;
    }

    .markdown p.sub-title {
      font-size: 20px;
      font-style: normal;
      line-height: 24px;
    }

    .markdown .points {
      width: calc(33% - 15px);
    }
  }
`;
