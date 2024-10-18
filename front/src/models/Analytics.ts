export type TEventType =
  | "signup_screen_view"
  | "signup_screen_tap"
  | "signup_complete"
  | "login_screen_view"
  | "login_screen_tap"
  | "login_complete"
  | "account_screen_view"
  | "account_claim_tap"
  | "quest_tap"
  | "quest_tasks_bar_tap"
  | "quest_tasks_filter_tap"
  | "quest_scoreboard_tap"
  | "quest_task_done"
  | "quest_share_tap"
  | "referral_share_tap"
  | "referral_screen_view"
  | "first_visit"
  | "onboarding_tap"
  | "ecosystem_project_tap"
  | "create_quest"
  | "schedule_call"
  | "page_visit"
  | "wallet_connect_click"
  | "wallet_connect_done"
  | "wallet_verify_done"
  | "show_more_tap"
  | "marketing_cost"
  | "daily_task_done"
  | "quest_luckyDrawWinnersBoard_tap";

export interface ISourceInfo {
  user_property_utm_source: string | null;
  user_property_utm_medium: string | null;
  user_property_utm_campaign: string | null;

  user_property_initial_utm_source: string | null;
  user_property_initial_utm_medium: string | null;
  user_property_initial_utm_campaign: string | null;
}

export interface IAccountUserProps {
  user_property_user_creation_time: Date | null;
  user_property_is_wallet_connected: boolean | null;
  user_property_is_logined: boolean | null;
  user_property_active_quests: number | null;
  user_property_investor_id: string | number | null;
  user_property_total_quests: number | null;
  user_property_is_referral: boolean | null;
  user_property_referral_code: string | null;
}

export interface ISystemUserProps {
  user_property_user_platform: string | null;
  user_property_user_os: string | null;
}

export interface IUserProperties
  extends ISourceInfo,
    IAccountUserProps,
    ISystemUserProps {}

export interface ICommonEventProperties {
  event_property_current_page?: string | null;
  event_property_previous_page?: string | null;
}

interface IMarketingEventProperties {
  event_property_ad_cost?: string;
  event_property_ad_type?: string;
  event_property_utm_source?: string;
  event_property_utm_medium?: string;
  event_property_utm_campaign?: string;
  event_property_ad_year?: number;
  event_property_ad_month?: number;
  event_property_ad_date?: number;
}

export interface IEventProperties
  extends ICommonEventProperties,
    IMarketingEventProperties {
  event_property_signup_source?: string | null;
  event_property_signup_with_referral?: boolean | null;
  event_property_filter_type?: string | null;
  event_property_quest_share_source?: string | null;
  event_property_referral_share_source?: string | null;
  event_property_task_name?: string | null;
  event_property_task_id?: string | number | null;
  event_property_quest_name?: string | null;
  event_property_task_points?: number | null;
  event_property_task_type?: string | null;
  event_property_task_position?: number | null;
  event_property_tasks_done?: number | null;
  event_property_tasks_remainig?: number | null;
  event_property_leaderboard_position?: number | null;
  event_property_quest_points_sum?: number | null;
  event_property_quest_position?: number | null;
  event_property_project_name?: string | null;
  event_property_earned_points?: number | null;
  event_property_likes_count?: number | null;
  event_property_retweets_count?: number | null;
  event_property_start_time?: Date | null;
  event_property_daily_task_number?: number;
  event_property_daily_tasks_done?: number;
  event_property_daily_tasks_remaining?: number;
}

interface IEventOptions extends IEventProperties, IUserProperties {}

export interface IAnalyticsData {
  eventType: TEventType;
  eventOptions: IEventOptions;
  userId: string;
  sessionId: string;
  country: string;
  deviceId: string;
}

export interface IUserMetaData {
  cookieAG?: string;
  cookieGA?: string;
  ipAddress?: string;
  lang?: string;
  timezone?: string;
  userAgent?: string;
  country?: string;
  fromAddress?: string;
  previousPage?: string;
}
