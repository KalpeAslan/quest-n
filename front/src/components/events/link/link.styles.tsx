import styled from "@emotion/styled";
import { Button } from "@components/UI/button";
import Image from "next/image";

const LinkStylesWrapper = styled.div`
  position: relative;
  padding: 30px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;

  @media screen and (min-width: 1280px) {
    padding: 0;
  }
`;

const LinkStylesImage = styled(Image)`
  width: 78px;
  height: 49px;
  margin: 0 auto 10px;
  display: block;
`;

const LinkStylesCaption = styled.h2`
  margin-bottom: 30px;
  color: var(--color-w1);
  font-weight: 700;
  font-size: 46px;
  line-height: 56px;
  text-align: center;
`;

const LinkStylesButton = styled(props => <Button {...props} />)`
  width: auto;
`;

export {
  LinkStylesButton,
  LinkStylesCaption,
  LinkStylesImage,
  LinkStylesWrapper,
};
