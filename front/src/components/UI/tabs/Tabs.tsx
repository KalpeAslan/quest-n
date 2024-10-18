import classnames from "classnames";
import { Wrapper } from "./tabs.styles";

interface ITab {
  id: number;
  tab: string;
  title: string;
}

type Props = {
  type: "primary" | "secondary" | "tertiary";
  activeTab: string;
  tabs: ITab[];
  changeFn: (value: string) => void;
  buttonType?: "submit" | "reset" | "button";
  isDisabled?: boolean;
};

const Tabs = ({
  type,
  activeTab,
  tabs,
  changeFn,
  buttonType,
  isDisabled,
}: Props) => {
  return (
    <>
      {tabs.length > 0 && (
        <Wrapper
          className={classnames({
            tabs: type === "primary",
            ["tabs-s"]: type === "secondary",
            ["tabs-t"]: type === "tertiary",
          })}
          isDisabled={isDisabled}
        >
          {tabs.map((tab: ITab) => (
            <button
              className={classnames({
                tab: type === "primary",
                ["tab-s"]: type === "secondary",
                ["tab-t"]: type === "tertiary",
                ["active-tab"]: activeTab === tab.tab && type === "primary",
                ["active-tab-s"]: activeTab === tab.tab && type === "secondary",
                ["active-tab-t"]: activeTab === tab.tab && type === "tertiary",
                ["c-font-20-24 c-fw-500"]: type === "primary",
                ["c-font-14-20"]: type === "secondary",
              })}
              key={tab.id}
              onClick={() => changeFn(tab.tab)}
              type={buttonType}
            >
              {tab.title}
            </button>
          ))}
        </Wrapper>
      )}
    </>
  );
};

Tabs.defaultProps = {
  type: "primary",
} as Partial<Props>;

export default Tabs;
