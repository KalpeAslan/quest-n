import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import { Icon } from "../icon";
import classNames from "classnames";
import { Wrapper } from "./selector.styles";
import { Scroll } from "../scroll";
import { appConfig } from "@/app.config";
import Image from "next/image";

interface Props {
  options: {
    value: string | number;
    title: string;
    icon?: string;
    image?: string;
    iconColor?: string;
    iconSize?: string;
    divided?: boolean;
  }[];
  onSelect: (data: string | number) => void;
  value: string | number;
  className?: string;
  zIndex?: number;
  onClick?: (open: boolean) => void;
  disabled?: boolean;
  dividedTitle?: string;
}

const Selector = ({
  options,
  onSelect,
  value,
  className,
  zIndex,
  onClick,
  disabled,
  dividedTitle,
}: Props) => {
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);

  const currentOption = useMemo(
    () => options.find(item => item.value === value),
    [options, value],
  );

  const mainOptions = useMemo(
    () => options.filter(item => item.value !== value && !item.divided),
    [options, value],
  );

  const dividedOptions = useMemo(
    () => options.filter(item => item.value !== value && item.divided),
    [options, value],
  );

  return (
    <Wrapper
      position="relative"
      width="200px"
      height="52px"
      zIndex={zIndex || 1}
      className={className}
    >
      <Box
        component="ul"
        position="absolute"
        top={0}
        onClick={() => {
          if (disabled) return;
          setSelectorOpen(prev => !prev);
          if (onClick) onClick(!selectorOpen);
        }}
        width="200px"
        p={0}
        m={0}
        sx={{ listStyle: "none", cursor: "pointer" }}
        bgcolor="#101313"
        border="1px solid rgba(255, 255, 255, 0.1)"
        borderRadius="10px"
        zIndex={1}
      >
        <Box
          component="li"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p="14px 16px"
        >
          <Box
            component="span"
            maxWidth="calc(100% - 30px)"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
            display="flex"
            alignItems="center"
          >
            {currentOption?.icon && (
              <Icon
                name={currentOption?.icon}
                size={currentOption?.iconSize || "25"}
                className="itemIcon"
                color={currentOption?.iconColor}
              />
            )}
            {currentOption?.image && (
              <Image
                alt={currentOption.title}
                src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${currentOption.image}`}
                width={25}
                height={25}
                className="itemIcon"
              />
            )}
            {currentOption?.title}
          </Box>
          <Icon
            className={classNames({ opened: selectorOpen }, "icon")}
            name="menu-select"
            size="20"
          />
        </Box>

        <Scroll styles={{ maxHeight: "235px" }}>
          {selectorOpen && Boolean(dividedOptions.length) && (
            <>
              <Box
                component="h3"
                className="c-font-color c-font-16-18 c-fw-500"
                pt={2}
                pl={2}
                pr={2}
                pb={0.5}
              >
                {dividedTitle}
              </Box>

              {dividedOptions.map(item => (
                <Box
                  component="li"
                  key={item.value}
                  onClick={() => {
                    if (disabled) return;
                    onSelect(item.value);
                  }}
                  p="14px 16px"
                  display="flex"
                  alignItems="center"
                  className="selectorItem"
                >
                  {item.icon && (
                    <Icon
                      name={item.icon}
                      size={item.iconSize || "25"}
                      className="itemIcon"
                      color={item.iconColor}
                    />
                  )}
                  {item.image && (
                    <Image
                      alt={item.title}
                      src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${item.image}`}
                      width={25}
                      height={25}
                      className="itemIcon"
                    />
                  )}
                  {item.title}
                </Box>
              ))}
            </>
          )}

          {selectorOpen &&
            Boolean(dividedOptions.length) &&
            Boolean(mainOptions.length) && <Box className="selectorDivider" />}

          {selectorOpen &&
            Boolean(mainOptions.length) &&
            mainOptions.map(item => (
              <Box
                component="li"
                key={item.value}
                onClick={() => {
                  if (disabled) return;
                  onSelect(item.value);
                }}
                p="14px 16px"
                display="flex"
                alignItems="center"
                className="selectorItem"
              >
                {item.icon && (
                  <Icon
                    name={item.icon}
                    size={currentOption.iconSize || "25"}
                    className="itemIcon"
                    color={item.iconColor}
                  />
                )}
                {item.image && (
                  <Image
                    alt={item.title}
                    src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${item.image}`}
                    width={25}
                    height={25}
                    className="itemIcon"
                  />
                )}
                {item.title}
              </Box>
            ))}
        </Scroll>
      </Box>
    </Wrapper>
  );
};

export default Selector;
