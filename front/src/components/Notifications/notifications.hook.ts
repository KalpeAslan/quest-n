import { INotification } from "@store/slices/notifications/notifications.slice";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getNotificationsSelector } from "@store/slices/notifications/notifications.selecor";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { getNotificationsThunk } from "@store/slices/notifications/notifications.actions";
import { useBoolean } from "@hooks/useBoolean";

export function useInfiniteScrollNotifications() {
  const { value: isLoading, setFalse, setValue } = useBoolean(true);
  const notifications: INotification[] = useTypedSelector(
    getNotificationsSelector,
  );
  const hasMore = useTypedSelector(state => state.notifications.hasMore);

  const dispatch = useAppDispatch();

  const fetchNotifications = async (page: number) => {
    if (!hasMore) return;
    try {
      await dispatch(getNotificationsThunk({ pageSize: 7, page }));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setFalse();
    }
  };

  return {
    notifications,
    isLoading,
    fetchMore: fetchNotifications,
    setIsLoading: setValue,
  };
}
