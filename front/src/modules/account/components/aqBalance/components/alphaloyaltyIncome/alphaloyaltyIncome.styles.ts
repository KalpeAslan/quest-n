import styled from "@emotion/styled";

export const AlphaLoyaltyIncomeWrapper = styled.section`
  padding: 16px;
  background: rgb(135 246 150 / 5%);
  border-radius: 16px;

  .header {
    display: flex;
    justify-content: space-between;
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
    flex-direction: column;
    gap: 8px;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .info-item-title {
    max-width: 167px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .info-decor {
    flex: 1;
    height: 12px;
    min-width: 10px;
    margin: 0 5px 5px;
    background-image: linear-gradient(
      to right,
      var(--sticky-menu-info-title-color) 33%,
      rgb(255 255 255 / 0%) 0%
    );
    background-position: bottom;
    background-size: 5px 1px;
    background-repeat: repeat-x;
  }
`;
