import styled from "@emotion/styled";
import Image from "next/image";

type TImageStylesOpacity = {
  isOpacity: boolean;
};

export const ImageStylesWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ImageStylesOpacity = styled(Image)<TImageStylesOpacity>`
  ${props => props.isOpacity && "opacity: 0;"}
`;

export const ImageStylesLoaderWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
