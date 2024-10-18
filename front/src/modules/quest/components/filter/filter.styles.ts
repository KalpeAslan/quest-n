import styled from "@emotion/styled";

export const FilterWrapper = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  gap: 16px;
  max-width: 400px;

  .filter-wrapper-desctop {
    flex: 1;
    display: flex;
    align-items: center;
    order: 0;
    gap: 8px;
  }

  .filter-wrapper-mobile {
    order: 1;
  }

  .selects {
    display: none;
  }

  @media (min-width: 768px) {
    max-width: initial;
    flex-direction: column;

    .filter-wrapper-mobile {
      display: none;
    }

    .selects {
      display: block;
    }
  }
`;
