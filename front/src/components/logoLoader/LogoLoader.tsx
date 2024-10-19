import { Icon } from "../UI/icon";
import { Wrapper } from "./logoLoader.styles";
import loaderImage from "@assets/images/loader.webp";
import Image from "next/image";
import { FC } from "react";

interface Props {
  className?: string;
  logoSize?: number;
  loaderSize?: number;
  disableLogo?: boolean;
}

const LogoLoader: FC<Props> = ({
  className,
  logoSize,
  loaderSize,
  disableLogo,
}) => {
  return (
    <Wrapper className={className} loaderSize={loaderSize}>
      {!disableLogo && (
        <img className={'icon'} width={logoSize || 57} height={logoSize || 57} src={'https://optim.tildacdn.pro/tild3535-3538-4238-a132-623935623039/-/resize/120x/-/format/webp/Light_1000x900.png'} />
      )}
      <Image src={loaderImage} alt="loader" className="image" />
    </Wrapper>
  );
};

export default LogoLoader;
