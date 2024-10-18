import styled from "@emotion/styled";

export const MonthlyReferralVolumeWrapper = styled.section`
  padding: 16px;
  background: rgb(135 246 150 / 5%);
  border-radius: 16px;

  .header {
    display: flex;
    justify-content: space-between;
  }

  .title {
    display: inline-flex;
    align-items: flex-start;
  }

  .filter {
    display: flex;
    gap: 8px;
  }

  .filter-item {
    padding: 4px 10px;
    color: var(--filter-item-text-color);
    background-color: var(--filter-item-background-color);
    border: none;
    border-radius: 24px;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
  }

  .filter-item:focus-visible {
    outline: 2px solid var(--button-primary-hover-background-color);
    outline-offset: "2px";
  }

  .filter-item-active {
    color: var(--filter-active-item-text-color);
    background-color: var(--filter-active-item-background-color);
    cursor: initial;
  }

  .progress {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
  }

  .progress-wrapper {
    position: relative;
    width: 100%;
    height: 4px;
    background-color: rgb(135 246 150 / 5%);
    border-radius: 4px;
  }

  .progress-score {
    height: 4px;
    background: linear-gradient(
      270deg,
      rgb(136 246 150 / 50%) 0%,
      rgb(136 246 150 / 0%) 100%
    );
    border-radius: 4px;
  }

  .progress-footer {
    margin-bottom: 3px;
    display: flex;
    justify-content: space-between;
  }

  .link {
    color: var(--footer-nav-color);
    font-weight: 400 !important;
    font-size: 14px !important;
    line-height: 20px !important;
    text-decoration: underline;
    transition: color 0.3s;
  }

  .link:hover {
    color: var(--text-link-color);
    text-decoration: none;
  }
`;
