import styled from "@emotion/styled";

export const Wrapper = styled.section<{ preview?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  ${props => props.preview && "overflow: hidden;"}

  @media (min-width: 768px) {
    margin: 0;
  }
`;
