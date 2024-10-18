import styled from "@emotion/styled";
import { Button } from "@components/UI/button";

const FilterWrappedStylesWrapper = styled.section`
  position: relative;
`;

const FilterWrappedStylesMenuWrapper = styled.section`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background-color: #101313;
  z-index: 12;
`;

const FilterWrappedStylesMenuHeader = styled.header`
  padding: 13px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--menu-border-color);
`;

const FilterWrappedStylesMenuClose = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
`;

const FilterWrappedStylesButton = styled(props => <Button {...props} />)`
  width: 100%;
`;

const FilterWrappedStylesContentWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
`;

const FilterWrappedStylesContent = styled.div`
  margin-top: 12px;
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FilterWrappedStylesFooter = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
`;

const FilterWrappedStylesFilterButton = styled(props => <Button {...props} />)`
  position: relative;
  padding: 11px 15px !important;

  .active-filters {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #87f696;
    border-radius: 50%;
  }
`;

export {
  FilterWrappedStylesButton,
  FilterWrappedStylesContent,
  FilterWrappedStylesContentWrapper,
  FilterWrappedStylesFooter,
  FilterWrappedStylesMenuClose,
  FilterWrappedStylesMenuHeader,
  FilterWrappedStylesWrapper,
  FilterWrappedStylesMenuWrapper,
  FilterWrappedStylesFilterButton,
};
