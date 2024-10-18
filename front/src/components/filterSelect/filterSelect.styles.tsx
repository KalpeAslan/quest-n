import styled from "@emotion/styled";
import { Button } from "@components/UI/button";

const FilterStylesWrapper = styled.section`
  position: relative;
`;

const FilterStylesSelectButton = styled(props => <Button {...props} />)`
  display: block;
`;

const FilterStylesMenuWrapper = styled.section`
  position: absolute;
  top: 51px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 5;
`;

const FilterStylesCloser = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  z-index: 1;
`;

const FilterStylesContent = styled.div`
  position: relative;
  background-color: var(--menu-background-color);
  border-radius: 10px;
  overflow: hidden;
  z-index: 2;
`;

const FilterStylesItems = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  list-style: none;
`;

const FilterStylesItem = styled.li`
  min-width: 0;
  display: flex;
`;

const FilterStylesButton = styled.button`
  width: 100%;
  padding: 12px 13px;
  display: flex;
  align-items: flex-start;
  color: #fff;
  background-color: rgb(39 42 42 / 100%);
  border: none;
  text-align: left;
  transition: background-color 0.3s;
  outline: none;

  &.active {
    color: #87f696;
    background-color: rgb(135 246 150 / 10%);
  }

  &:hover {
    background-color: rgb(135 246 150 / 20%);
    cursor: pointer;
  }

  &.active:focus-visible,
  &:focus-visible {
    background-color: rgb(135 246 150 / 20%);
  }

  .icon {
    height: 22px;
    display: flex;
    align-items: center;
  }
`;

export {
  FilterStylesButton,
  FilterStylesCloser,
  FilterStylesContent,
  FilterStylesItem,
  FilterStylesItems,
  FilterStylesMenuWrapper,
  FilterStylesSelectButton,
  FilterStylesWrapper,
};
