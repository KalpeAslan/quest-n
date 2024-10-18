import { commonApi } from "@store/common.api";

export const questApi = commonApi.injectEndpoints({
  endpoints: builder => ({
    getQuestAnalyticsWinners: builder.query({
      query(questLinkTitle) {
        return {
          url: `/analytics/${questLinkTitle}/winners`,
        };
      },
    }),
    getQuestAnalyticsEligibleUsers: builder.query({
      query(questLinkTitle) {
        return {
          url: `/analytics/${questLinkTitle}/eligibleUsers`,
        };
      },
    }),
    getQuestAnalytics: builder.query({
      query(questLinkTitle: string) {
        return {
          url: `/analytics/${questLinkTitle}`,
        };
      },
    }),
    getQuestAnalyticsTasks: builder.query({
      query({
        questLinkTitle,
        endDate,
        startDate,
      }: {
        questLinkTitle: string;
        startDate: string;
        endDate: string;
      }) {
        return {
          url: `/analytics/${questLinkTitle}/tasks-completion?start=${
            startDate ? new Date(startDate).getTime() : 0
          }&end=${endDate ? new Date(endDate).getTime() : 0}`,
        };
      },
    }),
    getQuestCompletionAnalyticsTasks: builder.query({
      query(questLinkTitle: string) {
        return {
          url: `/analytics/${questLinkTitle}/tasks`,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetQuestAnalyticsQuery,
  useGetQuestAnalyticsTasksQuery,
  useGetQuestCompletionAnalyticsTasksQuery,
  useGetQuestAnalyticsWinnersQuery,
  useGetQuestAnalyticsEligibleUsersQuery,
} = questApi;
