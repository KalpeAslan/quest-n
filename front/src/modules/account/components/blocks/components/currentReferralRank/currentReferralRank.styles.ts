import styled from "@emotion/styled";

export const CurrentReferralRankWrapper = styled.section`
  padding: 16px;
  background: rgb(135 246 150 / 5%);
  border-radius: 16px;

  .header {
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

  .pre-head {
    display: flex;
    align-items: center;
  }

  .title {
    display: inline-flex;
    align-items: flex-start;
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
    max-width: 215px;
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

  .progress {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
  }

  .progress-wrapper {
    position: relative;
    width: 100%;
    height: 4px;
    margin-bottom: 7px;
    background-color: rgb(0 0 0 / 30%);
  }

  .progress-score {
    height: 4px;
    background: linear-gradient(270deg, #d0e356 0%, #87f696 100%);
  }

  .progress-score-point {
    position: absolute;
    top: -2px;
    width: 8px;
    height: 8px;
    background: #cfe356;
    border-radius: 50%;
  }

  .progress-footer {
    display: flex;
    justify-content: space-between;
  }
`;
