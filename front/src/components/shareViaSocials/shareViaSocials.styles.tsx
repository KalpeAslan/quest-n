import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Icon } from "@components/UI/icon";

const ShareViaSocialsStylesHeader = styled.h3`
  margin-bottom: 12px;
  color: rgb(255 255 255 / 30%);
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
`;

const ShareViaSocialsStylesList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  gap: 16px;
  justify-content: center;
  list-style: none;
`;

const ShareViaSocialsStylesListItem = styled.li`
  flex: 1;
`;

const ShareViaSocialsStylesLink = css`
  width: 100%;
  padding: 12px !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgb(255 255 255 / 10%) !important;
  border-radius: 10px;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgb(255 255 255 / 20%) !important;
  }
`;

const ShareViaSocialsStylesIcon = styled(props => <Icon {...props} />)`
  color: #1d9bf0;

  @media screen and (min-width: 1024px) {
    margin-bottom: 4px;
  }
`;

const ShareViaSocialsStylesLabel = styled.span`
  display: none;
  color: #fafafa;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  @media screen and (min-width: 1024px) {
    display: block;
  }
`;

export {
  ShareViaSocialsStylesHeader,
  ShareViaSocialsStylesList,
  ShareViaSocialsStylesListItem,
  ShareViaSocialsStylesLink,
  ShareViaSocialsStylesIcon,
  ShareViaSocialsStylesLabel,
};
