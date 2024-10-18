import { commonApi } from "@store/common.api";

export const accountApi = commonApi.injectEndpoints({
  endpoints: builder => ({
    getUserReferral: builder.query({
      query() {
        return {
          url: "investor/referral",
        };
      },
    }),
    getUserAnalyticsInfo: builder.query({
      query() {
        return {
          url: "investor/analytics",
        };
      },
    }),
    getUserProfile: builder.query({
      query() {
        return {
          url: "investor/profile",
        };
      },
    }),
    getProfileRewards: builder.query({
      query(args) {
        let url = "/profiles/rewards";
        let querySymbol = "?";
        const query = Object.keys(args).reduce((acc, key) => {
          if (args[key]) {
            acc += `${querySymbol}${key}=${args[key]}`;
            querySymbol = "&";
          }
          return acc;
        }, "");
        url += query;
        return {
          url,
        };
      },
    }),
    getProfileQuests: builder.query({
      query(args) {
        let url = "/profiles/quests";
        let querySymbol = "?";
        const query = Object.keys(args).reduce((acc, key) => {
          if (args[key]) {
            acc += `${querySymbol}${key}=${args[key]}`;
            querySymbol = "&";
          }
          return acc;
        }, "");
        url += query;
        return {
          url,
        };
      },
    }),
    getProfileExp: builder.query({
      query() {
        return {
          url: "/profiles/experiences",
        };
      },
    }),
    getUserSettingsModal: builder.query({
      query(type) {
        return {
          url: `/profiles/userModalSetting?type=${type}`,
        };
      },
    }),
    getProfileProjects: builder.query({
      query() {
        return {
          url: "/investor/partner-projects",
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserReferralQuery,
  useGetUserAnalyticsInfoQuery,
  useGetUserProfileQuery,
  useGetProfileRewardsQuery,
  useGetProfileQuestsQuery,
  useGetProfileExpQuery,
  useGetProfileProjectsQuery,
  useGetUserSettingsModalQuery,
  endpoints: accountApiEndpoints,
} = accountApi;
