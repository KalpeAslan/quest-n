import styled from "@emotion/styled";

export const PickerWrapper = styled.section`
  display: none;

  .items {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .item {
    padding: 20px;
    display: flex;
    color: var(--text-color-2);
    cursor: pointer;
  }

  .active {
    background-color: var(--about-us-background-color);
    border-radius: 16px;
  }

  .icon {
    min-width: 24px;
    margin-right: 12px;
  }

  .image {
    width: 100%;
    margin-left: 65px;
    max-width: 480px;
    position: relative;
  }

  .image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    aspect-ratio: 1 / 1;
  }

  @media (min-width: 1024px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
