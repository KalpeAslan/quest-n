import styled from "@emotion/styled";

export const AlphaguiltyIncomeWrapper = styled.section`
  padding: 16px 16px 12px;
  background: rgb(135 246 150 / 5%);
  border-radius: 16px;

  .header {
    position: relative;
    display: flex;
    justify-content: space-between;
    z-index: 1;
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

  .info {
    display: flex;
    gap: 8px;
  }

  .footer {
    display: flex;
    gap: 4px;

    &::-webkit-scrollbar {
      display: none;
    }

    & {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  }
`;
