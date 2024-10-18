import { Advertisement } from "@/models";
import { FC } from "react";
import { Wrapper } from "./advertisementsBlock.styles";
import { Box } from "@mui/material";
import Marquee from "react-fast-marquee";
import classNames from "classnames";
import { Tooltip } from "@/components/UI/tooltip";
import { Icon } from "@/components/UI/icon";

interface Props {
  items: Advertisement[];
}

const AdvertisementsBlock: FC<Props> = ({ items }) => {
  return items.length ? (
    <Wrapper>
      {items.map(item =>
        Boolean(item.items.length) ? (
          <Box key={item.id} className="item">
            <Box className="titleBlock">
              {item.icon && (
                <Icon
                  name="fire"
                  className="c-font-color-3 icon"
                  width={10}
                  height={16}
                />
              )}

              <Box
                component="h2"
                className="title c-font-color-3 c-font-12-16 c-sm-font-18-25 c-fw-400"
              >
                {item.title}
              </Box>
              {item.tooltip && (
                <Tooltip value={item.tooltip} placement="top" followCursor>
                  <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
                </Tooltip>
              )}
            </Box>

            <Marquee autoFill pauseOnHover>
              {item.items.map(adItem => (
                <Box
                  key={adItem.text}
                  className={classNames(
                    "adItem c-font-color c-fw-400 c-font-12-16 c-sm-font-16-22",
                    {
                      highlighted: adItem.highlighted,
                    },
                  )}
                >
                  {adItem.url ? (
                    <Box component="a" href={adItem.url} target="_blank">
                      {adItem.text}
                    </Box>
                  ) : (
                    <Box component="p">{adItem.text}</Box>
                  )}
                  <Box className="divider" />
                </Box>
              ))}
            </Marquee>
          </Box>
        ) : null,
      )}
    </Wrapper>
  ) : null;
};

export default AdvertisementsBlock;
