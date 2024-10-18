import { createAsyncThunk } from "@reduxjs/toolkit";
import { notificationsService } from "@api";
import { IGetAll } from "@api/services/notifications";
import { RootState } from "@store/store";
import {
  setNotificationsHasMore,
  setNewNotificationsExist,
} from "@store/slices/notifications/notifications.slice";

export const getNotificationsThunk = createAsyncThunk(
  "getNotificationsThunk",
  async (query: IGetAll, { rejectWithValue, dispatch, getState }) => {
    try {
      return notificationsService.getAll(query).then(({ items, total }) => {
        const state = getState() as RootState;
        const { notifications } = state.notifications;
        if (notifications.length >= total || !items.length) {
          dispatch(setNotificationsHasMore(false));
        }
        return items;
      });
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

export const readNotifications = createAsyncThunk(
  "readNotifications",
  async (ids: number[], { rejectWithValue, dispatch }) => {
    try {
      const notViewedNotifications = await notificationsService.read(ids);
      dispatch(
        setNewNotificationsExist(
          notViewedNotifications && notViewedNotifications.length,
        ),
      );
      return ids;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);
