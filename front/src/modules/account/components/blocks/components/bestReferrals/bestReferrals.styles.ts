import styled from "@emotion/styled";

export const BestReferralsWrapper = styled.div`
  padding: 16px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 16px;
  text-align: center;

  .table .table-body-list > li:last-child {
    padding-bottom: 0;
    border: none;
  }

  .table .table-body-list > li:last-child {
    border: none;
  }

  .table .table-body-list > li:last-child li {
    padding-bottom: 0;
  }

  @media (min-width: 768px) {
    width: calc(33.3% - 6px);
  }
`;

export const InfoWrapper = styled.div`
  display: flex;
  align-items: center;

  .image {
    width: 20px;
    min-width: 20px;
    height: 20px;
  }
`;
