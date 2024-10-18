import styled from "@emotion/styled";
import { Icon } from "@components/UI/icon";

export const LikeStylesWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const LikeStylesIcon = styled(props => <Icon {...props} />)`
  cursor: pointer;

  &.active {
    fill: #fff;
  }
`;
