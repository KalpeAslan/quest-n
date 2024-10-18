import { FC } from "react";
import { Box } from "@mui/material";
import classnames from "classnames";
import { Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import { Button } from "@components/UI/button";
import { Scroll } from "@components/UI/scroll";

import { EButtonLocation } from "@models";
import { Wrapper } from "./filterSelectedItems.styles";

interface FilterSelectedItemsProps {
  className?: string;
  clearButtonLocation?: EButtonLocation;
  campaingsValues: string[];
  rewardsValues: string[];
  statusesValues?: string[];
  questsValues?: string[];
  setCampaingsValues: React.Dispatch<React.SetStateAction<string[]>>;
  setRewardsValues: React.Dispatch<React.SetStateAction<string[]>>;
  setStatusesValues?: React.Dispatch<React.SetStateAction<string[]>>;
  setQuestsValues?: React.Dispatch<React.SetStateAction<string[]>>;
  handleCLearAllFilters: () => void;
}

const FilterSelectedItems: FC<FilterSelectedItemsProps> = ({
  className,
  clearButtonLocation = EButtonLocation.START,
  campaingsValues,
  rewardsValues,
  statusesValues,
  setCampaingsValues,
  setRewardsValues,
  setStatusesValues,
  handleCLearAllFilters,
  questsValues,
  setQuestsValues,
}) => {
  return (
    <Wrapper className={className}>
      <Scroll overflowBehavior={{ x: "scroll", y: "hidden" }} type="table">
        <div className="items">
          {clearButtonLocation === EButtonLocation.START && (
            <Button
              className="button-clear"
              style="ghost"
              size="small"
              onClick={handleCLearAllFilters}
            >
              <Box className="c-font-14-18 c-font-color-3">
                <Trans id="6i8t3Eiq3Cua45K73dJDf8-quest">Reset filters</Trans>
              </Box>
            </Button>
          )}

          {campaingsValues.length > 0 &&
            campaingsValues.map(item => (
              <Button
                className="button"
                style="checked"
                size="medium"
                key={item}
              >
                <Box className="button-content">
                  <p className={classnames("item-text", "c-font-14-18")}>
                    {item}
                  </p>

                  <Icon
                    name="menu-close"
                    height="16"
                    width="16"
                    onClick={() => {
                      const newState = [...campaingsValues];
                      const itemIndex = campaingsValues.findIndex(
                        filter => filter === item,
                      );
                      newState.splice(itemIndex, 1);

                      setCampaingsValues(newState);
                    }}
                  />
                </Box>
              </Button>
            ))}

          {rewardsValues.length > 0 &&
            rewardsValues.map(item => (
              <Button
                className="button"
                style="checked"
                size="medium"
                key={item}
              >
                <Box className="button-content">
                  <p className={classnames("item-text", "c-font-14-18")}>
                    {item}
                  </p>

                  <Icon
                    name="menu-close"
                    height="16"
                    width="16"
                    onClick={() => {
                      const newState = [...rewardsValues];
                      const itemIndex = rewardsValues.findIndex(
                        filter => filter === item,
                      );
                      newState.splice(itemIndex, 1);

                      setRewardsValues(newState);
                    }}
                  />
                </Box>
              </Button>
            ))}

          {(statusesValues?.length || 0) > 0 &&
            statusesValues.map(item => (
              <Button
                className="button"
                style="checked"
                size="medium"
                key={item}
              >
                <Box className="button-content">
                  <p className={classnames("item-text", "c-font-14-18")}>
                    {item}
                  </p>

                  <Icon
                    name="menu-close"
                    height="16"
                    width="16"
                    onClick={() => {
                      const newState = [...statusesValues];
                      const itemIndex = statusesValues.findIndex(
                        filter => filter === item,
                      );
                      newState.splice(itemIndex, 1);

                      setStatusesValues(newState);
                    }}
                  />
                </Box>
              </Button>
            ))}
          {(questsValues?.length || 0) > 0 &&
            questsValues.map(item => (
              <Button
                className="button"
                style="checked"
                size="medium"
                key={item}
              >
                <Box className="button-content">
                  <p className={classnames("item-text", "c-font-14-18")}>
                    {item}
                  </p>

                  <Icon
                    name="menu-close"
                    height="16"
                    width="16"
                    onClick={() => {
                      const newState = [...questsValues];
                      const itemIndex = questsValues.findIndex(
                        filter => filter === item,
                      );
                      newState.splice(itemIndex, 1);

                      setQuestsValues(newState);
                    }}
                  />
                </Box>
              </Button>
            ))}

          {clearButtonLocation === EButtonLocation.END && (
            <Button
              className="button-clear"
              style="ghost"
              size="small"
              onClick={handleCLearAllFilters}
            >
              <Box className="c-font-14-18 c-font-color-3">
                <Trans id="enkE93u9uPvnqECYhvcycL-quest">Reset filters</Trans>
              </Box>
            </Button>
          )}
        </div>
      </Scroll>
    </Wrapper>
  );
};

export default FilterSelectedItems;
