import { Box, Divider } from "@mui/material";
import { FC, Fragment, useEffect, useMemo } from "react";
import {
  INotification,
  setIsNotificationsMuted,
} from "@store/slices/notifications/notifications.slice";
import { t, Trans } from "@lingui/macro";
import Icon from "@components/UI/icon/Icon";
import { NotificationsItem } from "@components/Notifications/NotificationsListItem";
import Tooltip from "@components/UI/tooltip/Tooltip";
import { LocalStorageService } from "@services";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { muteNotificationsKey } from "@context/notifications";
import { readNotifications } from "@store/slices/notifications/notifications.actions";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getIsNotificationsMuted } from "@store/slices/notifications/notifications.selecor";
import { useClaimExperienceStarter } from "@/hooks";

interface IProps {
  notifications: INotification[];
}

export const NotificationsList: FC<IProps> = ({ notifications }) => {
  const { isClaimed: isStarterNftClaimed } = useClaimExperienceStarter();

  const newNotifications = useMemo(() => {
    return notifications.filter(notification => !notification.viewed);
  }, [notifications]);

  const dispatch = useAppDispatch();

  const isMuted = useTypedSelector(getIsNotificationsMuted);

  const muteToggle = () => {
    if (!isMuted) LocalStorageService.setItem(muteNotificationsKey, "true");
    if (isMuted) LocalStorageService.removeItem(muteNotificationsKey);
    dispatch(
      setIsNotificationsMuted(
        LocalStorageService.getItem(muteNotificationsKey) === "true",
      ),
    );
  };

  useEffect(() => {
    const notViewedNotifications = notifications
      .filter(
        item =>
          !item.viewed && (item.type !== "onBoarding" || isStarterNftClaimed),
      )
      .map(item => item.id);
    if (notViewedNotifications.length)
      dispatch(readNotifications(notViewedNotifications));
  }, [dispatch, isStarterNftClaimed, notifications]);

  return (
    <div onClick={e => e.stopPropagation()}>
      <div className={"c-flex-items-center items-justified-space-between"}>
        <p className={"c-font-color c-font-16-18"}>
          {newNotifications.length ? (
            <Trans id={"werstyu-nbvcd-jlkh-2"}>
              {newNotifications.length} new notifications
            </Trans>
          ) : (
            <Trans id={"sdbshkfq-gieuoi-qwdfbv-213"}>Notifications</Trans>
          )}
        </p>
        <Tooltip
          value={
            isMuted
              ? t({
                  message: "Unmute Notification",
                  id: "2dfghjk-oiuy-bnk-quest",
                })
              : t({
                  message: "Mute Notification",
                  id: "dfghjk-oiuy-bnk-quest",
                })
          }
        >
          <Box
            onClick={muteToggle}
            borderRadius={5}
            width={25}
            height={25}
            className={"c-flex-items-center c-flex-center"}
            bgcolor={"rgba(255, 255, 255, 0.10)"}
            color={`var(${isMuted ? "--color-o3" : "--color-gr2"})`}
          >
            <Icon
              size={"15"}
              color={`var(${isMuted ? "--color-o3" : "--color-gr2"}`}
              name={isMuted ? "notifications_muted" : "bell"}
            />
          </Box>
        </Tooltip>
      </div>
      <Box mt={1.5} pb={4}>
        {notifications.length ? (
          <>
            {notifications.map((item, index) => (
              <Fragment key={item.id}>
                {0 === index && <Divider style={{ marginBottom: 15 }} />}
                <NotificationsItem data={item} />
                <Divider sx={{ my: "15px" }} />
              </Fragment>
            ))}
          </>
        ) : (
          <Box
            component={"p"}
            color={"rgba(255, 255, 255, 0.40)"}
            className={"c-font-16-18"}
          >
            <Trans id={"xcvbnm-lkjhgfds-wdfvb-2"}>
              No new notifications yet
            </Trans>
          </Box>
        )}
      </Box>
    </div>
  );
};
