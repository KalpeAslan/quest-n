import { FC, useMemo, useState } from "react";
import classnames from "classnames";
import { Box } from "@mui/material";

import { ISelect, ISelectItem } from "@models";
import { Icon } from "@components/UI/icon";
import { Wrapper } from "./showMoreSelect.styles";

type ShowMoreSelectProps = {
  className?: string;
  selectedValues: string[];
  selectData: ISelect;
  handleSelectedValuesChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const ShowMoreSelect: FC<ShowMoreSelectProps> = ({
  className,
  selectedValues,
  selectData,
  handleSelectedValuesChange,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

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
    <Wrapper className={className}>
      <button
        className={classnames(
          "menu-btn",
          { opened: isOpened },
          "c-font-color c-fw-500",
        )}
        onClick={() => setIsOpened(!isOpened)}
      >
        <Box component="p" className={classnames("c-font-20-24")} mr={2}>
          {selectData.title}
        </Box>

        <Box ml="auto" className="menu-btn-icon">
          <Icon
            style={{ transform: isOpened ? "rotate(180deg)" : undefined }}
            name="menu-select"
            size="24"
          />
        </Box>
      </button>

      <Box className={classnames("content", { show: isOpened })}>
        {selectItems.length > 0 &&
          selectItems.map((item: ISelectItem) => (
            <button
              className={classnames("button", { active: item.isSelected })}
              key={item.id}
              onClick={() => handleToogle(item.value, Boolean(item.isSelected))}
            >
              <Box className="c-font-16-24 c-fw-400" component="p" mr={2}>
                {item.title}
              </Box>

              {item.isSelected && (
                <Box className="icon" ml="auto">
                  <Icon name="check-mark" size="18" />
                </Box>
              )}
            </button>
          ))}
      </Box>
    </Wrapper>
  );
};

export default ShowMoreSelect;
