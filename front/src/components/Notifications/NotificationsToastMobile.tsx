import React, { useEffect, useMemo } from "react";
import { Box, Slide, Theme, useMediaQuery } from "@mui/material";
import Icon from "@components/UI/icon/Icon";
import { Trans } from "@lingui/macro";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useBoolean } from "@hooks/useBoolean";
import { NotificationsList } from "@components/Notifications/NotificationsList";
import Scroll from "@components/UI/scroll/Scroll";
import { useGetNotificationsQuery } from "@store/slices/notifications/notifications.api";
import { getAccountState } from "@modules/account/store/account.selector";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { setShowMobileNotificationToast } from "@store/slices/notifications/notifications.slice";
import { CBreakpoints } from "@styles/variables";
import Loader from "@components/UI/loader/Loader";

export const NotificationsToastMobile = () => {
  const { isAccountLoaded } = useTypedSelector(getAccountState);
  const dispatch = useAppDispatch();

  const showMobileNotificationToast = useTypedSelector(
    state => state.notifications.showMobileNotificationToast,
  );

  const { data, isLoading } = useGetNotificationsQuery(
    {
      pageSize: 7,
      page: 1,
    },
    {
      skip: !isAccountLoaded || !showMobileNotificationToast,
    },
  );

  const isSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.sm),
  );

  const notViewedNotifications = useMemo(() => {
    if (!data || !data.items) return 0;
    return data.items.filter(item => !item.viewed);
  }, [data]);

  const { value: expanded, setTrue: openExp } = useBoolean(false);

  useEffect(() => {
    if (notViewedNotifications.length > 0) {
      const timerOpen = setTimeout(() => {
        dispatch(setShowMobileNotificationToast(true));
      }, 5000);

      const timerClose = setTimeout(() => {
        dispatch(setShowMobileNotificationToast(false));
      }, 10000);

      return () => {
        clearTimeout(timerOpen);
        clearTimeout(timerClose);
      };
    }
  }, [notViewedNotifications]);

  return (
    <Slide
      direction="down"
      in={showMobileNotificationToast && isSm}
      mountOnEnter
      unmountOnExit
    >
      <Box
        border={"1px solid var(--color-gr2)"}
        width={275}
        bgcolor={"#161818"}
        position="fixed"
        top={56}
        left={0}
        right={0}
        ml={"auto"}
        mr={"auto"}
        borderRadius={"10px"}
        maxHeight={450}
        sx={{
          transition: "max-height 0.5s ease-in-out",
        }}
        padding={"17px 12px 20px 12px"}
        onClick={openExp}
        overflow={"hidden"}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {!expanded && (
              <Box>
                <Box
                  position={"relative"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"start"}
                >
                  <Box color={"var(--color-gr2)"} mr={1}>
                    <Icon name={"bell"} size={"33"} />
                  </Box>
                  <div>
                    <p className={"c-font-12-14 c-font-color"}>
                      <Trans id={"wscvbgfdw-fjjhgsdf-9845-quest"}>
                        You have {notViewedNotifications.length} new
                        notifications
                      </Trans>
                    </p>
                  </div>
                  <Box
                    onClick={e => {
                      e.stopPropagation();
                      dispatch(setShowMobileNotificationToast(false));
                    }}
                    color={"#868686"}
                    position={"absolute"}
                    right={5}
                    top={6}
                  >
                    <Icon name={"menu-close"} size={"15"} />
                  </Box>
                </Box>
              </Box>
            )}

            {expanded && (
              <Box maxHeight={370}>
                <Scroll
                  styles={{
                    maxHeight: 370,
                    overflowY: "auto",
                    height: "100%",
                  }}
                >
                  <NotificationsList
                    notifications={data && data.items ? data.items : []}
                  />
                </Scroll>
              </Box>
            )}
          </>
        )}
      </Box>
    </Slide>
  );
};
