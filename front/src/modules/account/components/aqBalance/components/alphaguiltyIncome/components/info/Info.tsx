import { HelperService } from "@services";
import { InfoWrapper } from "./info.styles";

type Props = {
  title: string;
  subtitle: string;
  points: number;
};

const Info = ({ title, subtitle, points }: Props) => {
  return (
    <InfoWrapper>
      <p className="c-font-12-16 c-font-color">{title}</p>
      <p className="c-font-12-16 c-font-color-3">
        {subtitle} {HelperService.addNumberSeparator(points)} AQ
      </p>
    </InfoWrapper>
  );
};

export default Info;
