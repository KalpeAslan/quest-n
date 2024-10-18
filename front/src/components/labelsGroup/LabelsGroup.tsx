import { useMemo, useRef } from "react";
import { useWindowSize } from "@hooks";
import { HelperService } from "@services";

import {
  LabelsPrefixStylesInvLabel,
  LabelsPrefixStylesLabel,
  LabelsPrefixStylesLabels,
  LabelsPrefixStylesLabelsBasic,
  LabelsPrefixStylesSliceLabel,
  LabelsPrefixStylesWrapper,
} from "./labelsGroup.styles";

interface Ilabel {
  id: number;
  size: number;
  title: string;
}

type Props = {
  labels: string[];
  type?: "basic" | "slice";
};

const LabelsGroup = ({ labels, type }: Props) => {
  const { width } = useWindowSize();
  const ref = useRef<HTMLDivElement>(null);

  const itemsList = useMemo(() => {
    const items: Ilabel[] = [];

    if (typeof window !== "undefined") {
      labels.forEach((label: string, ii: number) => {
        const labelItemSize = HelperService.getTextWidth(label);

        if (labelItemSize) {
          const labelItemSizeWithPadding = +labelItemSize + 24;

          items.push({
            id: ii,
            size: labelItemSizeWithPadding,
            title: label,
          });
        }
      });

      return items;
    }

    return [];
  }, [labels]);

  const visibleItems = useMemo(() => {
    if (type === "basic") {
      return;
    }

    if (ref && ref.current && ref.current.parentElement) {
      const parentWidth = ref.current.parentElement.offsetWidth;
      const items: Ilabel[] = [];
      let count = 45;

      itemsList.forEach((item: Ilabel) => {
        const summ = count + item.size;

        if (summ < parentWidth) {
          count += item.size;
          items.push(item);
        }
      });

      return items;
    }
  }, [width, itemsList]);

  const leftItemsLength = useMemo(() => {
    if (!visibleItems || type === "basic") {
      return;
    }

    return labels.length - visibleItems.length;
  }, [visibleItems]);

  return (
    <>
      {type === "slice" && (
        <LabelsPrefixStylesWrapper ref={ref}>
          <LabelsPrefixStylesLabels>
            {labels.length > 0 &&
              visibleItems &&
              visibleItems.map(label => (
                <LabelsPrefixStylesSliceLabel
                  className={"c-font-12-16 c-font-color"}
                  key={label.id}
                >
                  {label.title}
                </LabelsPrefixStylesSliceLabel>
              ))}
          </LabelsPrefixStylesLabels>

          {!!leftItemsLength && (
            <LabelsPrefixStylesLabel className={"c-font-12-16 c-font-color"}>
              + {leftItemsLength}
            </LabelsPrefixStylesLabel>
          )}

          {labels.length > 0 &&
            labels.map(label => (
              <LabelsPrefixStylesInvLabel key={label}>
                {label}
              </LabelsPrefixStylesInvLabel>
            ))}
        </LabelsPrefixStylesWrapper>
      )}

      {type === "basic" && (
        <LabelsPrefixStylesWrapper>
          <LabelsPrefixStylesLabelsBasic>
            {labels.length > 0 &&
              labels.map(label => (
                <LabelsPrefixStylesLabel
                  className={"c-font-12-16 c-font-color"}
                  key={label}
                >
                  {label}
                </LabelsPrefixStylesLabel>
              ))}
          </LabelsPrefixStylesLabelsBasic>
        </LabelsPrefixStylesWrapper>
      )}
    </>
  );
};

LabelsGroup.defaultProps = {
  type: "slice",
} as Partial<Props>;

export default LabelsGroup;
