import { combineReducers, configureStore } from "@reduxjs/toolkit";
import systemReducer from "./slices/system/system.slice";
import analyticsSlice from "./slices/analytics/analytics.slice";
import accountSlice from "@modules/account/store/account.slice";
import notifications from "./slices/notifications/notifications.slice";
import { commonApi } from "@store/common.api";

const combineReducer = combineReducers({
  system: systemReducer,
  account: accountSlice,
  analytics: analyticsSlice,
  [commonApi.reducerPath]: commonApi.reducer,
  notifications: notifications,
});

export const store = configureStore({
  reducer: combineReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      commonApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
