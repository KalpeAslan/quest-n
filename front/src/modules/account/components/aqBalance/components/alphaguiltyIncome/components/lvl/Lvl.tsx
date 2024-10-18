import classnames from "classnames";

import { Image } from "@components/UI/image";
import { HelperService } from "@services";
import { LvlWrapper } from "./lvl.styles";

type Props = {
  image: string;
  points: number;
  name: string;
  highlited: boolean;
};

const Lvl = ({ image, points, name, highlited }: Props) => {
  return (
    <LvlWrapper className={classnames({ ["active"]: highlited })}>
      <div className="image">
        <Image src={image} alt={name} size="10" />
      </div>

      <p className="c-font-10-14 c-font-color">{name}</p>
      <p className="c-font-10-14 c-font-color">
        {points ? HelperService.addNumberSeparator(points) : 0} AQ
      </p>
    </LvlWrapper>
  );
};

export default Lvl;
