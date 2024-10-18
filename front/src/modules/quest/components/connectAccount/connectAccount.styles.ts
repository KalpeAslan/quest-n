import styled from "@emotion/styled";

export const Wrapper = styled.section`
  margin: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .text {
    color: var(--footer-nav-color);
  }

  .link {
    color: var(--footer-nav-color);
    text-decoration: underline;
    transition: color 0.3s;
  }

  .link:hover {
    color: var(--text-link-color);
    text-decoration: none;
  }
`;
