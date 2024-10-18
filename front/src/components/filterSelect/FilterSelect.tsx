import { useState, useMemo } from "react";
import { Box } from "@mui/material";
import classnames from "classnames";

import { ISelect, ISelectItem } from "@models";
import { Icon } from "@components/UI/icon";
import {
  FilterStylesWrapper,
  FilterStylesSelectButton,
  FilterStylesItems,
  FilterStylesMenuWrapper,
  FilterStylesCloser,
  FilterStylesItem,
  FilterStylesContent,
  FilterStylesButton,
} from "./filterSelect.styles";

type Props = {
  className?: string;
  isDisabled?: boolean;
  selectedValues: string[];
  selectData: ISelect;
  handleSelectedValuesChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const FilterSelect = ({
  className,
  isDisabled = false,
  selectedValues,
  selectData,
  handleSelectedValuesChange,
}: Props) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const showList = useMemo(() => {
    if (isDisabled) {
      return false;
    }

    return isOpened;
  }, [isOpened, isDisabled]);

  const selectItems = useMemo(() => {
    const selectedValuesString = selectedValues.join(",");

    return selectData.items.map((item: ISelectItem) => ({
      ...item,
      isSelected: selectedValuesString.includes(item.value),
    }));
  }, [selectData, selectedValues]);

  const handleToogle = (value: string, status: boolean) => {
    const newState = [...selectedValues];

    if (status) {
      const itemIndex = selectedValues.findIndex(item => item === value);
      newState.splice(itemIndex, 1);

      handleSelectedValuesChange(newState);

      return;
    }
    newState.push(value);
    handleSelectedValuesChange(newState);
  };

  return (
    <FilterStylesWrapper className={className}>
      <FilterStylesSelectButton
        style="outlined"
        size="medium"
        disabled={isDisabled}
        onClick={() => setIsOpened(!isOpened)}
      >
        <Box className="c-flex-items-center">
          <Box className="c-font-16-20" mr={2}>
            {selectData.title}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            mx={-0.5}
            my={-0.6}
            style={{ transform: isOpened ? "rotate(180deg)" : undefined }}
          >
            <Icon name="menu-select" size="24" />
          </Box>
        </Box>
      </FilterStylesSelectButton>

      {showList && (
        <FilterStylesMenuWrapper>
          <FilterStylesCloser
            onClick={() => setIsOpened(!isOpened)}
          ></FilterStylesCloser>

          <FilterStylesContent>
            <FilterStylesItems>
              {selectItems.length > 0 &&
                selectItems.map(item => (
                  <FilterStylesItem key={item.id}>
                    <FilterStylesButton
                      className={classnames({
                        active: item.isSelected,
                      })}
                      onClick={() => handleToogle(item.value, item.isSelected)}
                    >
                      <Box className="c-font-16-22" mr={2}>
                        {item.title}
                      </Box>

                      {item.isSelected && (
                        <Box className="icon" ml="auto">
                          <Icon name="check-mark" size="18" />
                        </Box>
                      )}
                    </FilterStylesButton>
                  </FilterStylesItem>
                ))}
            </FilterStylesItems>
          </FilterStylesContent>
        </FilterStylesMenuWrapper>
      )}
    </FilterStylesWrapper>
  );
};

FilterSelect.defaultProps = {
  isDisabled: false,
} as Partial<Props>;

export default FilterSelect;
