import { ISelect } from "@models";
import { FilterSelect } from "@components/filterSelect";
import { FilterWrapped } from "@components/filterWrapped";
import { SearchInput } from "@components/searchInput";
import { ShowMoreSelect } from "@components/UI/showMoreSelect";
import { FilterWrapper } from "./filter.styles";
import { FilterSelectedItems } from "../filterSelectedItems";

type FilterProps = {
  className?: string;
  isDisabled?: boolean;
  campaingsValues: string[];
  campaingsSelectData: ISelect;
  setCampaingsValues: React.Dispatch<React.SetStateAction<string[]>>;

  rewardsValues: string[];
  rewardsSelectData: ISelect;
  setRewardsValues: React.Dispatch<React.SetStateAction<string[]>>;

  statusesValues?: string[];
  statusesSelectData?: ISelect;
  setStatusesValues?: React.Dispatch<React.SetStateAction<string[]>>;

  questsValues?: string[];
  questsSelectData?: ISelect;
  setQuestsValues?: React.Dispatch<React.SetStateAction<string[]>>;

  handleCLearAllFilters: () => void;

  searchInput?: boolean;
  searchItems: string[];

  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  onSearch?: (v?: string | undefined) => void;
};

const Filter = ({
  className,
  isDisabled = false,
  campaingsValues,
  campaingsSelectData,
  setCampaingsValues,

  rewardsValues,
  rewardsSelectData,
  setRewardsValues,

  statusesValues,
  statusesSelectData,
  setStatusesValues,

  handleCLearAllFilters,

  searchInput = false,
  searchItems,
  inputValue,
  setInputValue,
  onSearch,
  setQuestsValues,
  questsSelectData,
  questsValues,
}: FilterProps) => {
  return (
    <FilterWrapper className={className}>
      <div className="filter-wrapper-mobile">
        <FilterWrapped
          wrapperId="quest-filter"
          isDisabled={isDisabled}
          activeFiltersNumber={
            campaingsValues.length +
            rewardsValues.length +
            (statusesValues?.length || 0)
          }
        >
          <>
            {campaingsValues.length > 0 ||
              rewardsValues.length > 0 ||
              (statusesValues?.length || 0) > 0 ||
              ((questsValues?.length || 0) > 0 && !isDisabled && (
                <FilterSelectedItems
                  campaingsValues={campaingsValues}
                  rewardsValues={rewardsValues}
                  statusesValues={statusesValues}
                  setCampaingsValues={setCampaingsValues}
                  setRewardsValues={setRewardsValues}
                  setStatusesValues={setStatusesValues}
                  handleCLearAllFilters={handleCLearAllFilters}
                  questsValues={questsValues}
                  setQuestsValues={setQuestsValues}
                />
              ))}

            {campaingsSelectData && (
              <ShowMoreSelect
                selectedValues={campaingsValues}
                selectData={campaingsSelectData}
                handleSelectedValuesChange={setCampaingsValues}
              />
            )}

            {rewardsSelectData && (
              <ShowMoreSelect
                selectedValues={rewardsValues}
                selectData={rewardsSelectData}
                handleSelectedValuesChange={setRewardsValues}
              />
            )}

            {statusesSelectData && (
              <ShowMoreSelect
                selectedValues={statusesValues}
                selectData={statusesSelectData}
                handleSelectedValuesChange={setStatusesValues}
              />
            )}

            {questsSelectData && (
              <ShowMoreSelect
                selectedValues={questsValues}
                selectData={questsSelectData}
                handleSelectedValuesChange={setQuestsValues}
              />
            )}
          </>
        </FilterWrapped>
      </div>

      <div className="filter-wrapper-desctop">
        {questsSelectData && (
          <FilterSelect
            className="selects"
            isDisabled={isDisabled}
            selectedValues={questsValues}
            selectData={questsSelectData}
            handleSelectedValuesChange={setQuestsValues}
          />
        )}

        {campaingsSelectData && (
          <FilterSelect
            className="selects"
            isDisabled={isDisabled}
            selectedValues={campaingsValues}
            selectData={campaingsSelectData}
            handleSelectedValuesChange={setCampaingsValues}
          />
        )}

        {campaingsSelectData && (
          <FilterSelect
            className="selects"
            isDisabled={isDisabled}
            selectedValues={rewardsValues}
            selectData={rewardsSelectData}
            handleSelectedValuesChange={setRewardsValues}
          />
        )}

        {statusesSelectData && (
          <FilterSelect
            className="selects"
            isDisabled={isDisabled}
            selectedValues={statusesValues}
            selectData={statusesSelectData}
            handleSelectedValuesChange={setStatusesValues}
          />
        )}
        {searchInput && onSearch && (
          <SearchInput
            items={searchItems}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSearch={onSearch}
          />
        )}
      </div>

      {campaingsValues.length > 0 ||
        rewardsValues.length > 0 ||
        (statusesValues?.length || 0) > 0 ||
        ((questsValues?.length || 0) > 0 && !isDisabled && (
          <div className="selects">
            <FilterSelectedItems
              campaingsValues={campaingsValues}
              rewardsValues={rewardsValues}
              statusesValues={statusesValues}
              setCampaingsValues={setCampaingsValues}
              setRewardsValues={setRewardsValues}
              setStatusesValues={setStatusesValues}
              questsValues={questsValues}
              handleCLearAllFilters={handleCLearAllFilters}
              setQuestsValues={setQuestsValues}
            />
          </div>
        ))}
    </FilterWrapper>
  );
};

export default Filter;
