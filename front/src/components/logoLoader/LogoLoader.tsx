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
        <Icon
          name="alphaguilty-task"
          size={logoSize ? `${logoSize}` : "57"}
          className="icon"
        />
      )}
      <Image src={loaderImage} alt="loader" className="image" />
    </Wrapper>
  );
};

export default LogoLoader;
