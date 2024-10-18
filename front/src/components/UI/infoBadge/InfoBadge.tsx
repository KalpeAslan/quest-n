import { Box } from "@mui/material";
import { CSSProperties, FC } from "react";
import Icon from "@components/UI/icon/Icon";

interface IProps {
  text: string;
  style?: CSSProperties;
}

export const InfoBadge: FC<IProps> = ({ text, style }) => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      bgcolor={"#2E3535"}
      style={style}
      padding={"14px 8px 14px 13px"}
      borderRadius={2}
    >
      <Icon name={"info"} />
      <Box ml={1} component={"span"}>
        {text}
      </Box>
    </Box>
  );
};
