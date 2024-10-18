import classnames from "classnames";
import styled from "@emotion/styled";
import { CSSProperties, MouseEvent } from "react";

type Props = {
  name: string;
  className?: string;
  size?: string;
  height?: string | number;
  width?: string | number;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<SVGElement>) => void;
  id?: string;
  color?: string;
};

const Icon = ({
  name,
  size,
  height,
  className,
  width,
  style,
  onClick,
  id,
  color,
}: Props) => {
  const vSize = size ? `${size}px` : "20px";
  const vHeight = `${height}px`;
  const vWidth = `${width}px`;

  return (
    <StyledSvg
      className={classnames(className, "c-icon")}
      style={{
        ...style,
        width: width ? vWidth : vSize,
        height: height ? vHeight : vSize,
        color: color || undefined,
      }}
      onClick={onClick}
      id={id}
    >
      <use xlinkHref={`#${name}`} id={id} />
    </StyledSvg>
  );
};

const StyledSvg = styled.svg`
  transition: fill 0.2s;
`;
export default Icon;
