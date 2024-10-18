import {
  ICommonEventProperties,
  IUserMetaData,
  IUserProperties,
} from "@models";

interface IAnalyticsState {
  isError: boolean;
  isAnalyticsDataLoaded: boolean;
  shouldRefetch: boolean;
  userData: Partial<IUserProperties>;
  commonEventProps: Partial<ICommonEventProperties>;
  userMetaData: Partial<IUserMetaData>;
  userId: string | null;
  isEventPropsLoaded: boolean;
  prevLocation: string | null;
}

export const initialState: IAnalyticsState = {
  isError: false,
  isAnalyticsDataLoaded: false,
  shouldRefetch: false,
  userData: {
    user_property_utm_source: null,
    user_property_utm_medium: null,
    user_property_utm_campaign: null,

    user_property_initial_utm_source: null,
    user_property_initial_utm_medium: null,
    user_property_initial_utm_campaign: null,

    user_property_user_creation_time: null,
    user_property_is_wallet_connected: false,
    user_property_is_logined: false,
    user_property_active_quests: null,
    user_property_investor_id: null,
    user_property_total_quests: null,
    user_property_is_referral: false,
    user_property_referral_code: null,

    user_property_user_platform: null,
    user_property_user_os: null,
  },
  commonEventProps: {
    event_property_current_page: null,
    event_property_previous_page: null,
  },
  userMetaData: {},
  userId: null,
  isEventPropsLoaded: false,
  prevLocation: null,
};
