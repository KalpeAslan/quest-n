import { useMemo, useState } from "react";
import classnames from "classnames";
import { Box } from "@mui/material";

import { IAboutDataItem } from "@/modules/aboutUs/models";

import { Icon } from "@components/UI/icon";

import { PickerWrapper } from "./picker.styles";
import Image from "next/image";

type Props = {
  data: IAboutDataItem[];
};

const Picker = ({ data }: Props) => {
  const [currentItemId, setCurrentItemId] = useState<number>(1);

  const activeItem = useMemo(() => {
    const activeItem = data.find(
      (item: IAboutDataItem) => item.id === currentItemId,
    );

    return activeItem;
  }, [currentItemId]);

  return (
    <PickerWrapper>
      <div className="items">
        {data.map((item: IAboutDataItem) => (
          <div
            className={classnames(
              currentItemId === item.id ? "active" : "",
              "item",
            )}
            key={item.id}
            onClick={() => setCurrentItemId(item.id)}
          >
            <Icon className="icon" name={item.icon} size="24" />

            <div>
              <Box
                component="p"
                className="c-font-20-28 c-fw-500 c-font-color"
                mb={0.25}
              >
                {item.title}
              </Box>

              {item.description && currentItemId === item.id && (
                <p className="c-font-16-22 c-font-color-6">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="image">
        <Image
          className="lazyload"
          title={activeItem?.title}
          src={activeItem?.image.src}
          alt={activeItem?.title}
          fill
        />
      </div>
    </PickerWrapper>
  );
};

export default Picker;
