import styled from "@emotion/styled";

export const TagsSectionStylesWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  &.active-slide,
  &.show-slide {
    margin-right: -16px;
    gap: 8px;
    flex-wrap: nowrap;
  }
`;

export const ActiveSlideStyles = styled.div`
  max-width: calc(100vw - 16px);
  height: 38px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: nowrap;

  .tag {
    white-space: nowrap;
  }
`;

export const TagStyles = styled.button`
  padding: 4px 10px;
  display: inline-flex;
  color: var(--labels-group-color);
  background-color: var(--labels-group-background-color);
  border-radius: 24px;
  border: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--button-primary-hover-background-color);
    outline-offset: "2px";
  }

  &.tag-item-active,
  &.tag-item-active-all {
    color: var(--filter-active-item-text-color);
    background-color: var(--filter-active-item-background-color);
  }

  &.tag-item-active-all {
    cursor: initial;
  }
`;
