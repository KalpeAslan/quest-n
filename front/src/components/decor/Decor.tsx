import { Icon } from "@components/UI/icon";

import {
  DecorStylesColor,
  DecorStylesIcon,
  DecorStylesWrapper,
} from "./decor.styles";

type Props = {
  icon?: boolean;
};

const Decor = ({ icon }: Props) => {
  return (
    <DecorStylesWrapper>
      {icon ? (
        <DecorStylesIcon>
          <Icon className="decorIcon" name="decor" />
        </DecorStylesIcon>
      ) : (
        <DecorStylesColor />
      )}
    </DecorStylesWrapper>
  );
};

Decor.defaultProps = {
  icon: false,
} as Partial<Props>;

export default Decor;
