import styled from "@emotion/styled";

export const SubscriptionStylesWrapper = styled.div<{ hasError: boolean }>`
  margin-bottom: ${props => (props.hasError ? "35px" : "8px")};
`;

export const SubscriptionStylesInputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: inline-block;

  .c-input {
    width: 100%;
    padding-right: 44px;
  }

  .input input {
    padding: 12px 70px 12px 12px;
  }

  .clear {
    right: 45px !important;
    top: 4px !important;
  }

  .error {
    position: absolute;
  }
`;

export const SubscriptionStylesMessage = styled.p`
  margin-top: 4px;
`;
