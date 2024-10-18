import styled from "@emotion/styled";
import { Button } from "@components/UI/button";
import Image from "next/image";

export const AgendaStylesContainer = styled.section`
  position: relative;
  padding: 0 20px;

  @media screen and (min-width: 1280px) {
    margin-bottom: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
`;

export const AgendaStylesImage = styled(Image)`
  width: 47px;
  height: 52px;
  margin: 0 auto 9px;
  display: block;
`;

export const AgendaStylesCaption = styled.h2`
  margin-bottom: 20px;
  color: var(--color-w1);
  font-weight: 700;
  font-size: 46px;
  line-height: 56px;
  text-align: center;
`;

export const AgendaStylesText = styled.p`
  margin-bottom: 30px;
  color: var(--color-w1);
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.01em;
  text-align: center;

  @media screen and (min-width: 1280px) {
    width: 667px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
`;

export const AgendaStylesButton = styled(props => <Button {...props} />)`
  width: 100%;
`;

export const AgendaStylesDate = styled.div`
  width: calc(100% + 40px);
  margin-top: 52px;
  margin-bottom: 10px;
  padding: 20px 0;
  letter-spacing: 0.1em;
  color: var(--color-w1);
  background: linear-gradient(269.77deg, #21985d 10.15%, #083c9a 100.25%);
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  text-transform: uppercase;
  transform: translateX(-20px);

  @media screen and (min-width: 1280px) {
    width: auto;
    margin: 30px 50px 4px;
    border-radius: 10px;
    transform: none;
  }
`;

export const AgendaStylesList = styled.ul`
  width: calc(100% + 20px);
  margin: 0 0 0 -10px;
  padding: 0;
  list-style: none;

  @media screen and (min-width: 1280px) {
    width: auto;
    margin-right: 50px;
    margin-left: 50px;
  }
`;
