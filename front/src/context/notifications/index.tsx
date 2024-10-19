import React, { ReactNode, useEffect } from "react";
import { LocalStorageService } from "@services";
import { Socket } from "socket.io-client";
import {
  INotification,
  setIsAllNotificationsModalOpen,
  setIsNotificationsMuted,
} from "@store/slices/notifications/notifications.slice";
import { Box } from "@mui/material";
import Icon from "@components/UI/icon/Icon";
import Button from "@components/UI/button/Button";
import { Trans } from "@lingui/macro";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getIsNotificationsMuted } from "@store/slices/notifications/notifications.selecor";
import {
  MaterialDesignContent,
  SnackbarProvider,
  enqueueSnackbar,
  closeSnackbar,
} from "notistack";
import { styled } from "@mui/system";
import { NotificationSnackbarItem } from "@components/Notifications/NotificationSnackbarItem";
import { nextTick } from "@/utils";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";

interface NotificationProviderProps {
  children: ReactNode;
}

let socket: Socket;

export const muteNotificationsKey = "muteNotifications";

export const NotificationsProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [openSnackbars, setOpenSnackbars] = React.useState<INotification[]>([]);
  const isNotificationsMuted = useTypedSelector(getIsNotificationsMuted);

  const dispatch = useAppDispatch();

  useEffect(() => {
  }, []);

  const { push } = useRouter();

  useEffect(() => {
    if (!isMobile) {
      openSnackbars.forEach(snackbar => {
        enqueueSnackbar(
          <NotificationSnackbarItem
            data={snackbar}
            onClose={async () => {
              if (snackbar.payload.questLinkTitle) {
                await push(`/quest/${snackbar.payload.questLinkTitle}`);
              }
              closeSnackbar(snackbar.id);
              setOpenSnackbars(prevSnackbars =>
                prevSnackbars.filter(item => item.id !== snackbar.id),
              );
            }}
          />,
          {
            key: snackbar.id,
            preventDuplicate: true,
          },
        );
        updateActionsFooter();
      });
    }
  }, [openSnackbars, isMobile]);

  const updateActionsFooter = () => {
    nextTick(() => {
      const actions = document.querySelectorAll(".notification_actions");
      if (actions.length > 1) {
        const allWithoutLast = Array.from(actions).slice(0, -1);
        allWithoutLast.forEach(item => item.remove());
      }
    }, 100);
  };
  console.log("isMobile", isMobile);

  return (
    <SnackbarProvider
      maxSnack={5}
      autoHideDuration={5000}
      Components={{
        default: StyledMaterialDesignContent,
      }}
      action={() =>
        !isMobile && (
          <Box
            className={"notification_actions"}
            gap={"10px"}
            mt={2}
            display={"flex"}
            alignItems={"center"}
          >
            <Box
              flex={1}
              sx={{ button: { width: "100%", height: 48 } }}
              borderRadius={"10px"}
              bgcolor={"#161818"}
            >
              <Button
                onClick={() => {
                  setOpenSnackbars([]);
                  dispatch(setIsAllNotificationsModalOpen(true));
                }}
                size={"medium"}
                style={"colorfull"}
              >
                <Trans id={"wertynvd-ytuisdfv12-312"}>Show All</Trans>
              </Button>
            </Box>
            {!isNotificationsMuted && (
              <Box
                sx={{
                  button: {
                    border: "1px solid var(--color-o3)",
                    maxHeight: 48,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  },
                }}
              >
                <Button
                  onClick={() => {
                    LocalStorageService.setItem(muteNotificationsKey, "true");
                    dispatch(setIsNotificationsMuted(true));
                  }}
                  size={"medium"}
                  style={"outlined"}
                >
                  <Box display={"flex"} gap={"5px"}>
                    <Icon
                      className={"c-font-color-4"}
                      size={"18"}
                      name={"notifications_muted"}
                    />
                    <Trans id={"csdfghjhyrqw-fbjhs325"}>Mute</Trans>
                  </Box>
                </Button>
              </Box>
            )}
          </Box>
        )
      }
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-default": {
    background: "transparent !important",
    padding: "0 !important",
    display: "flex",
    flexDirection: "column",
    boxShadow: "none",
    "div:nth-child(2)": {
      width: "100%",
      padding: 0,
    },
    "#notistack-snackbar": {
      paddingBottom: 0,
      paddingTop: 0,
    },
  },
}));
