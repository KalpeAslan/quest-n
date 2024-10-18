import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import classnames from "classnames";
import { Icon } from "@components/UI/icon";
import { Button } from "@components/UI/button";
import { Input } from "@components/UI/input";
import {
  SearchInputStylesContainer,
  SearchInputStylesDropdown,
  SearchInputStylesInputWrapper,
} from "./searchInput.styles";
import { usePopper } from "react-popper";
import { useOnClickOutside } from "@/hooks";
import HTMLReactParser from "html-react-parser";
import { t } from "@lingui/macro";

interface SearchInputProps {
  items: string[];
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  onSearch: (v?: string) => void;
}

const SearchInput: FC<SearchInputProps> = ({
  items = [],
  inputValue,
  setInputValue,
  onSearch,
}) => {
  const [isDisplayed, setIsDislayed] = useState<boolean>(false);

  const search = useRef(null);
  const [referenceElement, setReferenceElement] =
    useState<HTMLElement | null>();
  const [popperElement, setPopperElement] = useState<HTMLElement | null>();

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 4],
        },
      },
    ],
    placement: "bottom-end",
    strategy: "absolute",
  });

  const boldString = (str: string, substr: string) => {
    const regexp = RegExp(substr, "gi");
    return str.replace(regexp, "<span>$&</span>");
  };

  useOnClickOutside(search, e => {
    const el = (e.target as HTMLElement).closest(".customselector");

    if (!el) {
      setIsDislayed(false);
    }
  });

  const filteredList = useMemo(() => {
    if (inputValue) {
      return items.filter(item =>
        item.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }

    return items;
  }, [inputValue, items]);

  return (
    <SearchInputStylesContainer className={"search-input"} ref={search}>
      <SearchInputStylesInputWrapper
        onSubmit={e => {
          e.preventDefault();

          onSearch(inputValue);
        }}
        ref={setReferenceElement}
      >
        <Input
          type="text"
          value={inputValue}
          placeholder={t({
            id: "vyys9NEf6sZe5SWhwwgpkd-searchInput",
            message: "Search",
          })}
          clearbtn={false}
          onFocus={() => setIsDislayed(true)}
          onBlur={e => {
            e.preventDefault();

            onSearch(inputValue);
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            setInputValue(value.toLowerCase());
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              onSearch(inputValue);
            }
          }}
        />
        <Button
          className="button"
          style="icon"
          type="button"
          onClick={() => onSearch(inputValue)}
        >
          <Icon name="quest-search" size="20" />
        </Button>
      </SearchInputStylesInputWrapper>
      {isDisplayed && (
        <SearchInputStylesDropdown
          className={"search-input__dropdown"}
          ref={setPopperElement}
          style={{ ...styles.popper }}
          {...attributes.popper}
        >
          {filteredList.map((item, i) => (
            <div
              key={i}
              className={classnames(
                "c-font-16-22 c-fw-400 c-font-color-8",
                "item",
                "search-input__item"
              )}
              onClick={() => {
                const value = item.toLowerCase();

                setInputValue(value);
                setIsDislayed(false);
                onSearch(value);
              }}
            >
              <p>{HTMLReactParser(boldString(item, inputValue))}</p>
            </div>
          ))}
        </SearchInputStylesDropdown>
      )}
    </SearchInputStylesContainer>
  );
};

export default SearchInput;
