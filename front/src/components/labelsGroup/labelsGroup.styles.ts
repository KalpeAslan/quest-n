import styled from "@emotion/styled";

export const LabelsPrefixStylesWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  &.slice {
  }
`;

export const LabelsPrefixStylesLabels = styled.div`
  display: flex;
  gap: 4px;
`;

export const LabelsPrefixStylesLabel = styled.div`
  padding: 4px 10px;
  display: inline-flex;
  border-radius: 24px;
  color: var(--labels-group-color);
  background-color: var(--labels-group-background-color);

  &::first-letter {
    text-transform: uppercase;
  }
`;

export const LabelsPrefixStylesSliceLabel = styled(LabelsPrefixStylesLabel)`
  white-space: nowrap;
`;

export const LabelsPrefixStylesInvLabel = styled.div`
  display: none;
`;

export const LabelsPrefixStylesLabelsBasic = styled(LabelsPrefixStylesLabels)`
  flex-wrap: wrap;
`;
