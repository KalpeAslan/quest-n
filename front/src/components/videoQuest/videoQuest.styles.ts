import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    max-width: 320px;
  }

  .iframe {
    width: 100%;
    height: 242px;
  }

  .iframe iframe {
    width: 100%;
    height: 100%;
  }

  .butt {
    min-width: 208px;
  }
`;
