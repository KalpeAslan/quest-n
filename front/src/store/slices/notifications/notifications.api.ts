import { commonApi } from "@store/common.api";

export const notificationsApi = commonApi.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query({
      query({ pageSize, page }: { pageSize: number; page: number }) {
        return {
          url: `notifications?page=${page}&pageSize=${pageSize}`,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetNotificationsQuery } = notificationsApi;
