import { useContextSelector } from "use-context-selector";
import { TranslatorContext, ILanguage } from "@context";
import { Icon } from "@components/UI/icon";

import { FC, useCallback, useRef, useState } from "react";
import classNames from "classnames";
import useOnClickOutside from "@hooks/useClickOutside";
import { Container } from "./languagesSelector.styles";

interface Props {
  className?: string;
}

const LanguagesSelector: FC<Props> = ({ className }) => {
  const [opened, setOpened] = useState(false);

  const languagesRef = useRef(null);

  const currentLanguage = useContextSelector(
    TranslatorContext,
    state => state.language,
  );
  const setCurrentLanguage = useContextSelector(
    TranslatorContext,
    state => state.loadLocale,
  );
  const languages = useContextSelector(
    TranslatorContext,
    state => state.languages,
  );

  useOnClickOutside(languagesRef, () => setOpened(false));

  const onLanguageClick = useCallback(
    (key: ILanguage) => {
      setOpened(prev => !prev);

      if (key === currentLanguage) {
        return;
      }

      if (!setCurrentLanguage) {
        return;
      }
      setCurrentLanguage(key);
    },
    [currentLanguage, setCurrentLanguage],
  );

  return (
    <Container className={className}>
      <ul ref={languagesRef} className={classNames("list", { opened })}>
        {(languages || []).map(item => {
          if (!opened && currentLanguage !== item.value) {
            return null;
          }

          return (
            <li className={"item"} key={item.value}>
              <button
                type="button"
                onClick={() => onLanguageClick(item.value)}
                className={"button"}
              >
                <Icon
                  className={"flagIcon"}
                  name={item.icon}
                  width={24}
                  height={16}
                />
                {currentLanguage === item.value && (
                  <Icon
                    className={classNames({ opened }, "icon")}
                    name="menu-select"
                    size="20"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Container>
  );
};

export default LanguagesSelector;
