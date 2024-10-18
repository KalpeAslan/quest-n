import Icon from "@components/UI/icon/Icon";
import { NotificationsList } from "@components/Notifications/NotificationsList";
import { useBoolean } from "@hooks/useBoolean";
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import Scroll from "@components/UI/scroll/Scroll";
import { useEffect, useRef } from "react";
import { useInfiniteScrollNotifications } from "@components/Notifications/notifications.hook";
import {
  setIsAllNotificationsModalOpen,
  setNotifications,
  setNotificationsHasMore,
} from "@store/slices/notifications/notifications.slice";
import { Trans } from "@lingui/macro";
import { useAppDispatch } from "@hooks/useAppDispatch";
import useClickOutside from "@hooks/useClickOutside";
import Loader from "@components/UI/loader/Loader";
import { useTypedSelector } from "@hooks/useTypedSelector";

export const Bell = () => {
  const { setTrue, value, setFalse } = useBoolean(false);

  const { notifications, fetchMore, isLoading, setIsLoading } =
    useInfiniteScrollNotifications();

  const isNewNotificationsExist = useTypedSelector(
    state => state.notifications.isNewNotificationsExist,
  );

  const refItem = useRef<HTMLDivElement>(null);
  const refList = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (value) {
      let page = 1;

      const handler = () => {
        const scrollHeight = scroll.scrollHeight - scroll.clientHeight;
        if (scroll.scrollTop === scrollHeight) {
          fetchMore(page);
          page = page + 1;
        }
      };

      const scroll = refItem.current.querySelector(
        ".os-viewport.os-viewport-scrollbar-hidden",
      );
      if (scroll) {
        scroll.addEventListener("scroll", handler);
      }
      return () => {
        if (refItem.current) {
          const scroll = refItem.current.querySelector(
            ".os-viewport.os-viewport-scrollbar-hidden",
          );
          if (scroll) scroll.removeEventListener("scroll", handler);
        }
      };
    }
  }, [refItem, value, fetchMore]);

  useClickOutside(refList, () => {
    setFalse();
    dispatch(setNotifications([]));
    dispatch(setNotificationsHasMore(true));
    setIsLoading(true);
  });

  return (
    <Box
      position={"relative"}
      width={24}
      height={24}
      color={isNewNotificationsExist ? "var(--color-gr2)" : "#989898"}
      ref={refItem}
    >
      <Icon
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          setTrue();
          fetchMore(1);
        }}
        size={"24"}
        name={isNewNotificationsExist ? "bell_active" : "bell"}
      />
      {value && (
        <StyledNotificationsList ref={refList}>
          <Box
            bottom={-7}
            position={"absolute"}
            minHeight={40}
            left={0}
            width={"100%"}
            zIndex={1}
            textAlign={"center"}
            bgcolor={"var(--color-b0)"}
            onClick={() => dispatch(setIsAllNotificationsModalOpen(true))}
          >
            <p
              className={"c-font-color-3 c-font-14-20"}
              style={{ fontWeight: 500, cursor: "pointer" }}
            >
              <Trans id={"dfvwergbn-hgfdr-13"}>Show all notifications</Trans>
            </p>
          </Box>
          {isLoading ? (
            <Loader />
          ) : (
            <Scroll
              styles={{
                maxHeight: 431,
                overflowY: "auto",
                width: "100%",
              }}
            >
              <NotificationsList notifications={notifications} />
            </Scroll>
          )}
        </StyledNotificationsList>
      )}
    </Box>
  );
};

const StyledNotificationsList = styled.div`
  border-radius: 10px;
  position: absolute;
  max-width: 275px;
  top: 60px;
  width: 275px;
  border: 0.3px solid var(--color-gr2);
  right: 0;
  background: var(--color-b0);
  padding: 14px 14px 29px 14px;
  max-height: 431px;
  overflow: hidden;
`;
