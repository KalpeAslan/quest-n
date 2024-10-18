import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";
import { initialState } from "./analytics.state";
import {
  IAccountUserProps,
  ISourceInfo,
  ISystemUserProps,
  IUserMetaData,
} from "@models";
import { LocalStorageService } from "@/services";
import { getUserMetaDataThunk } from "./analytics.thunks";
import { setIsOnboardingPopupOpen } from "../system/system.slice";

const analyticsSlice = createSlice({
  name: "analyticsSlice",
  initialState,
  reducers: {
    setInitialSourceInfoItem(
      state,
      action: PayloadAction<{
        itemName: keyof ISourceInfo;
        value: string | null;
      }>,
    ) {
      const { itemName, value } = action.payload;

      if (!value || value === "null") {
        LocalStorageService.removeItem(itemName);
        state.userData[itemName] = value;

        return;
      }

      LocalStorageService.setItem(itemName, value);
      state.userData[itemName] = value;
      state.isEventPropsLoaded = true;
    },
    setSourceInfoItem(
      state,
      action: PayloadAction<{
        itemName: keyof ISourceInfo;
        value: string | null;
      }>,
    ) {
      const { itemName, value } = action.payload;
      state.userData[itemName] = value;
      state.isEventPropsLoaded = true;
    },

    setAccountUserProperties(state, action: PayloadAction<IAccountUserProps>) {
      state.userData = { ...state.userData, ...action.payload };
      state.isEventPropsLoaded = true;
    },

    setSystemUserProperties(state, action: PayloadAction<ISystemUserProps>) {
      state.userData = { ...state.userData, ...action.payload };
      state.isEventPropsLoaded = true;
    },

    setUserId(state, action: PayloadAction<string | null>) {
      state.userId = action.payload;
      state.isEventPropsLoaded = true;
    },
    setPrevLocation(state, action: PayloadAction<string | null>) {
      state.commonEventProps.event_property_previous_page = action.payload;
      state.isEventPropsLoaded = true;
      state.prevLocation = action.payload;
    },
    setCurrentLocation(state, action: PayloadAction<string | null>) {
      state.commonEventProps.event_property_current_page = action.payload;
      state.isEventPropsLoaded = true;
    },
    setIsAnalyticsEventPropsLoaded(state, action: PayloadAction<boolean>) {
      state.isEventPropsLoaded = action.payload;
    },
    setShouldRefetch(state, action: PayloadAction<boolean>) {
      state.shouldRefetch = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(
      getUserMetaDataThunk.fulfilled,
      (state, action: PayloadAction<IUserMetaData>) => {
        state.userMetaData = action.payload;
      },
    );

    builder.addCase(
      setIsOnboardingPopupOpen,
      (state, action: PayloadAction<boolean>) => {
        if (!action.payload) {
          state.shouldRefetch = true;
        }
      },
    );

    builder.addMatcher(isPending, state => {
      state.isAnalyticsDataLoaded = true;
    });

    builder.addMatcher(isRejected, state => {
      state.isAnalyticsDataLoaded = false;
      state.isError = true;
    });

    builder.addMatcher(isFulfilled, state => {
      state.isAnalyticsDataLoaded = false;
    });
  },
});

export const {
  setInitialSourceInfoItem,
  setSourceInfoItem,
  setAccountUserProperties,
  setSystemUserProperties,
  setUserId,
  setPrevLocation,
  setCurrentLocation,
  setIsAnalyticsEventPropsLoaded,
  setShouldRefetch,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
