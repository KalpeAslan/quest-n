import { Box } from "@mui/material";
import Image from "next/image";
import { FC } from "react";
import Icon from "@components/UI/icon/Icon";

interface IProps {
  size: "small" | "medium" | "large";
  src: string;
  disabled?: boolean;
}

const sizes = {
  small: 50,
  medium: 56,
  large: 96,
};

export const ExperienceAvatar: FC<IProps> = ({ size, src, disabled }) => {
  return (
    <Box position={"relative"}>
      <Image
        className={"border-radius-img"}
        src={src}
        alt={"experience icon"}
        width={sizes[size]}
        height={sizes[size]}
      />
      {disabled && (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          position={"absolute"}
          left={"50%"}
          top={"50%"}
          zIndex={5}
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Icon
            name={"profile-lock"}
            size={String(sizes[size] / 2)}
            color={"white"}
          />
        </Box>
      )}
    </Box>
  );
};
