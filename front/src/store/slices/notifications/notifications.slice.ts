import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getNotificationsThunk,
  readNotifications,
} from "@store/slices/notifications/notifications.actions";
import { accountApi } from "@modules/account/store/account.api";
import { IGetUseAnalyticsInfo } from "@modules/account/models";

export interface INotification {
  title: string;
  id: number;
  type: string;
  payload: {
    message: string;
    questLinkTitle?: string;
  };
  viewed: boolean;
  createdAt: string | Date;
}

const initialState = {
  notifications: [],
  isAllNotificationsModalOpen: false,
  isMuted: false,
  isNewNotificationsExist: false,
  hasMore: true,
  showMobileNotificationToast: false,
};

const notificationsSlice = createSlice({
  name: "notificationsSlice",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload,
      );
    },
    setNotifications(state, action: PayloadAction<INotification[]>) {
      state.notifications = action.payload;
    },
    setIsAllNotificationsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAllNotificationsModalOpen = action.payload;
    },
    setIsNotificationsMuted(state, aciton: PayloadAction<boolean>) {
      state.isMuted = aciton.payload;
    },
    setNotificationsHasMore(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },
    setNewNotificationsExist(state, action: PayloadAction<boolean>) {
      state.isNewNotificationsExist = action.payload;
    },
    setShowMobileNotificationToast(state, action: PayloadAction<boolean>) {
      state.showMobileNotificationToast = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getNotificationsThunk.fulfilled, (state, action) => {
      state.notifications = [...state.notifications, ...action.payload];
    });

    builder.addCase(readNotifications.fulfilled, (state, action) => {
      state.notifications = state.notifications.map(item => ({
        ...item,
        viewed: item.viewed
          ? item.viewed
          : (action.payload as number[]).includes(item.id),
      }));
    });

    builder.addMatcher(
      accountApi.endpoints.getUserAnalyticsInfo.matchFulfilled,
      (state, action: PayloadAction<IGetUseAnalyticsInfo>) => {
        const { isNewNotificationsExist } = action.payload;

        state.isNewNotificationsExist = isNewNotificationsExist;
      },
    );
  },
});

export const {
  setIsNotificationsMuted,
  setIsAllNotificationsModalOpen,
  setNotifications,
  setNotificationsHasMore,
  setNewNotificationsExist,
  setShowMobileNotificationToast,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
