import styled from "@emotion/styled";

export const Items = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  .mobile,
  .medium {
    display: none;
  }

  @media (min-width: 768px) {
    .medium {
      display: flex;
    }
  }

  @media (min-width: 1024px) {
    .mobile {
      display: flex;
    }
  }
`;

export const Message = styled.p`
  max-width: 822px;
`;
