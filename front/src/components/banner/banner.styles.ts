import styled from "@emotion/styled";
import Link from "next/link";
import { media } from "@styles/mixins";

export const BannerStylesWrapper = styled.div`
  padding: 20px 38px;
  background: linear-gradient(
    93.6deg,
    #2cb4ef 0.92%,
    #18e5f8 18.89%,
    #29fbe0 40.08%,
    #59f9ba 63.47%,
    #36f0ca 84.18%,
    #1cbbae 99.3%
  );
  ${media.tabletMinWidth`
    display: flex;
    justify-content: center;
    background: linear-gradient(270.12deg, #0294c1 -.8%, #17cae8 4.51%, #0ef7f7 14.29%, #39fbd3 25.26%, #61f8b3 38.5%, #36fbd5 56.85%, #0af5fc 70.72%, #3fa2f8 86.12%, #537ef1 96%, #4845a0 102.63%);
`};
`;

export const BannerStylesContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  ${media.tabletMinWidth`
    flex: 1;
    flex-direction: row;
`};
`;

export const BannerStylesImage = styled.div`
  height: 60px;
  margin: -20px 22px -20px 0;
  max-width: 131px;
  display: none;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }

  ${media.tabletMinWidth`
    display: block;
  `};
`;

export const BannerStylesLink = styled(Link)`
  &,
  &:hover,
  &:active,
  &:visited {
    color: var(--text-color-1);
  }
  ${media.tabletMinWidth`
    margin-left: 10px;
  `};
`;

export const BannerStylesClose = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
`;
