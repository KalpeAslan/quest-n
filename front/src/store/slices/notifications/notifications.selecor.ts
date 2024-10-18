import { RootState } from "@store/store";

const key = "notifications";
export const getNotificationsSelector = (state: RootState) =>
  state[key].notifications;

export const getNotViewedNotificationsSelector = (state: RootState) =>
  state[key].notifications.filter(item => !item.viewed);

export const getIsAllNotificationsModalOpenSelector = (state: RootState) =>
  state[key].isAllNotificationsModalOpen;

export const getIsNotificationsMuted = (state: RootState) => state[key].isMuted;
