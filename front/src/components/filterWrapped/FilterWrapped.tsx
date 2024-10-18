import { useState, useMemo, FC, ReactNode } from "react";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Scroll } from "@components/UI/scroll";
import { Icon } from "@components/UI/icon";
import { Portal } from "@components/portal";

import {
  FilterWrappedStylesWrapper,
  FilterWrappedStylesFilterButton,
  FilterWrappedStylesMenuWrapper,
  FilterWrappedStylesMenuHeader,
  FilterWrappedStylesMenuClose,
  FilterWrappedStylesContentWrapper,
  FilterWrappedStylesContent,
  FilterWrappedStylesFooter,
  FilterWrappedStylesButton,
} from "./filterWrapped.styles";
import classNames from "classnames";

type FilterWrappedProps = {
  isDisabled?: boolean;
  children: ReactNode;
  wrapperId: string;
  activeFiltersNumber: number;
};

const FilterWrapped: FC<FilterWrappedProps> = ({
  isDisabled = false,
  children,
  wrapperId,
  activeFiltersNumber,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const showList = useMemo(() => {
    if (isDisabled) {
      return false;
    }

    return isOpened;
  }, [isOpened, isDisabled]);

  return (
    <FilterWrappedStylesWrapper>
      <FilterWrappedStylesFilterButton
        style="secondary"
        size="small"
        disabled={isDisabled}
        onClick={() => setIsOpened(!isOpened)}
      >
        <>
          {activeFiltersNumber > 0 && (
            <p
              className={classNames(
                "active-filters",
                "c-font-12-16 c-font-color-11",
              )}
            >
              {activeFiltersNumber}
            </p>
          )}
          <Box className="c-flex-items-center">
            <Icon name="filter" size="24" />
          </Box>
        </>
      </FilterWrappedStylesFilterButton>

      {showList && (
        <Portal wrapperId={wrapperId}>
          <FilterWrappedStylesMenuWrapper>
            <FilterWrappedStylesMenuHeader className="c-font-color">
              <p className="c-font-20-24 c-fw-500">
                <Trans id="heAtYhw1LZF3jAw69kYwu2-filterWrapped">Filters</Trans>
              </p>

              <FilterWrappedStylesMenuClose
                type="button"
                onClick={() => setIsOpened(!isOpened)}
              >
                <Icon
                  className="c-font-color"
                  name="menu-close"
                  height="20"
                  width="20"
                />
              </FilterWrappedStylesMenuClose>
            </FilterWrappedStylesMenuHeader>

            <FilterWrappedStylesContentWrapper>
              <Scroll>
                <FilterWrappedStylesContent>
                  {children}
                </FilterWrappedStylesContent>
              </Scroll>
            </FilterWrappedStylesContentWrapper>

            <FilterWrappedStylesFooter>
              <FilterWrappedStylesButton
                style="primary"
                size="small"
                onClick={() => setIsOpened(false)}
              >
                <Trans id="6drtUGvHZesucV6JoBfmV9-filterWrapped">
                  Show Results
                </Trans>
              </FilterWrappedStylesButton>
            </FilterWrappedStylesFooter>
          </FilterWrappedStylesMenuWrapper>
        </Portal>
      )}
    </FilterWrappedStylesWrapper>
  );
};

export default FilterWrapped;
