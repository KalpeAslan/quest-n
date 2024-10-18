import { RootState } from "@store/store";

const STATE_KEY = "analytics";

export const getAnalyticsState = (state: RootState) => state[STATE_KEY];

export const getUserMetaData = (state: RootState) =>
  state[STATE_KEY].userMetaData;
export const getShouldRefetch = (state: RootState) =>
  state[STATE_KEY].shouldRefetch;


export const getPrevLocation = (state: RootState) =>
  state[STATE_KEY].prevLocation;