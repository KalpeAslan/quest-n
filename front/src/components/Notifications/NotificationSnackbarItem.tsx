import { Box } from "@mui/material";
import Icon from "../UI/icon/Icon";
import React, { FC } from "react";
import { INotification } from "@store/slices/notifications/notifications.slice";

interface IProps {
  data: INotification;
  onClose: (id: number) => void;
}

export const NotificationSnackbarItem: FC<IProps> = ({
  data: { type, id, payload, title },
  onClose,
}) => {
  const computeIconName = () => {
    if (type === "scoreboard" || type === "luckyDraw")
      return `notification_${type}`;
    return "notification_main";
  };
  return (
    <Box>
      <Box
        padding={"17px 15px 19px 15px"}
        display={"flex"}
        borderRadius={"10px"}
        alignItems={"center"}
        border={"0.3px solid #87F696"}
        bgcolor={"#161818"}
        justifyContent={"start"}
        gap={"10px"}
        width={275}
        className={"c-font-color-3"}
        position={"relative"}
      >
        <Icon name={computeIconName()} size={"33"} />
        <Box>
          <p className={"c-font-12-14 c-font-color-3"}>{title}</p>
          <p className={"c-font-12-14 c-font-color"}>{payload.message}</p>
        </Box>
        <Box
          style={{
            position: "absolute",
            right: 10,
            top: 10,
          }}
          className={"c-pointer"}
          color={"#868686"}
          onClick={() => onClose(id)}
        >
          <Icon name={"menu-close"} size={"10"} />
        </Box>
      </Box>
    </Box>
  );
};
