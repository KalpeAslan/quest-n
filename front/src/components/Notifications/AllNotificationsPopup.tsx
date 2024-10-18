import Modal from "@components/UI/modal/Modal";
import { Box, Divider, Theme, useMediaQuery } from "@mui/material";
import { Trans } from "@lingui/macro";
import { FC, useState } from "react";
import { NotificationsItem } from "@components/Notifications/NotificationsListItem";
import { CBreakpoints } from "@styles/variables";
import Icon from "@components/UI/icon/Icon";
import classNames from "classnames";
import { useGetNotificationsQuery } from "@store/slices/notifications/notifications.api";
import Loader from "@components/UI/loader/Loader";
import Button from "@components/UI/button/Button";
import { getIsAllNotificationsModalOpenSelector } from "@store/slices/notifications/notifications.selecor";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { setIsAllNotificationsModalOpen } from "@store/slices/notifications/notifications.slice";
import { getAccountState } from "@modules/account/store/account.selector";

export const AllNotificationsPopup: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const open = useTypedSelector(getIsAllNotificationsModalOpenSelector);
  const dispatch = useAppDispatch();
  const { isAccountLoaded } = useTypedSelector(getAccountState);

  const { data, isLoading, isFetching } = useGetNotificationsQuery(
    {
      pageSize: 7,
      page: currentPage + 1,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !isAccountLoaded || !open,
    },
  );
  const isSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.sm),
  );

  const handleClose = () => dispatch(setIsAllNotificationsModalOpen(false));

  const renderContent = () => {
    if (isLoading || !data)
      return (
        <Box>
          <Loader />
        </Box>
      );

    const minHeightOfWindow = 525;
    if (isFetching) {
      return (
        <Box minHeight={minHeightOfWindow}>
          <Loader />
        </Box>
      );
    }

    const computeDate = (input: Date | string) => {
      const date = input instanceof Date ? input : new Date(input);

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear().toString();

      if (isSm) {
        return `${day}/${month}`;
      } else {
        return `${day}/${month}/${year}`;
      }
    };

    return data.items.length ? (
      <Box minHeight={minHeightOfWindow} position={"relative"}>
        {data.items.map((notification, index) => (
          <>
            <Box
              py={"20px"}
              className={"c-flex-items-center items-justified-space-between"}
              key={index}
            >
              <Box className={"c-flex-items-center"}>
                <Box mr={isSm ? "10px" : "20px"}>
                  <p
                    className={"c-font-14-22 c-font-color"}
                    style={{
                      color:
                        notification.viewed &&
                        "rgba(250, 250, 250, 0.70) !important",
                    }}
                  >
                    {computeDate(notification.createdAt)}
                  </p>
                </Box>
                <NotificationsItem data={notification} />
              </Box>
              {!notification.viewed && (
                <Box
                  width={10}
                  height={10}
                  borderRadius={"100%"}
                  bgcolor={"var(--color-gr2)"}
                />
              )}
            </Box>
            <Divider />
          </>
        ))}

        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          mt={"30px"}
          position={"relative"}
        >
          {!isSm && (
            <Box className={"c-flex-items-center"} gap={"15px"}>
              {[...Array(data.pagesCount as number).keys()].map(item => (
                <Box
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  width={item === currentPage ? 10 : 7}
                  height={item === currentPage ? 10 : 7}
                  className={item === currentPage ? "" : "c-pointer"}
                  borderRadius={100}
                  bgcolor={
                    item === currentPage
                      ? "var(--color-gr2)"
                      : "rgba(135, 246, 150, 0.60)"
                  }
                />
              ))}
            </Box>
          )}
          {currentPage !== 0 && (
            <Box
              sx={{
                button: {
                  px: 1.5,
                  py: 1,
                },
              }}
              left={0}
              position={"absolute"}
            >
              <Button
                onClick={() => setCurrentPage(prevState => prevState - 1)}
                size={"small"}
                style={"secondary"}
                disabled={isLoading || isFetching}
              >
                <Icon className={"c-flex"} name={"arrow-keyboard-left"} />
              </Button>
            </Box>
          )}

          {currentPage !== data.pagesCount - 1 && (
            <Box
              sx={{
                button: {
                  px: 1.5,
                  py: 1,
                },
              }}
              right={0}
              position={"absolute"}
            >
              <Button
                onClick={() => setCurrentPage(prevState => prevState + 1)}
                size={"small"}
                style={"secondary"}
                disabled={isLoading || isFetching}
              >
                <Icon className={"c-flex"} name={"arrow-keyboard-right"} />
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    ) : (
      <Box mt={2} width={"100%"} textAlign={"center"}>
        <p
          className={"c-font-14-20"}
          style={{ color: "rgba(255, 255, 255, 0.40)" }}
        >
          <Trans id={"yhbvcdghj-reguhi-qwe21"}>No new notifications yet</Trans>
        </p>
      </Box>
    );
  };

  return (
    <Modal isOpen={open} handleClose={handleClose} closeByOutsideClick>
      <Box
        width={"100%"}
        sx={theme => ({
          overflow: "hidden",
          [theme.breakpoints.down(CBreakpoints.md)]: {
            px: 3,
            display: "flex",
          },
          "& .all-notifcations_container": {
            width: 700,
            borderRadius: "16px",
            [theme.breakpoints.down(CBreakpoints.md)]: {
              width: "100vw",
            },
          },
        })}
      >
        <Box
          display={"flex"}
          className={"all-notifcations_container"}
          flexDirection={"column"}
          bgcolor={"var(--color-b0)"}
        >
          <Box
            py={2}
            width={"100%"}
            textAlign={"center"}
            position={"relative"}
            borderBottom={"1px solid rgba(255, 255, 255, 0.30)"}
          >
            <p
              className={classNames("c-font-color", {
                "c-font-24-31": !isSm,
                "c-font-20-20": isSm,
              })}
              style={{ fontWeight: 500 }}
            >
              <Trans id={"xcvbnlkjhgf-qvbdjv-13"}>All Notifications</Trans>
            </p>
            <Box
              position={"absolute"}
              right={16}
              top={16}
              onClick={handleClose}
              color={"white"}
              style={{ cursor: "pointer" }}
            >
              <Icon size={"24"} name={"menu-close"} />
            </Box>
          </Box>
          <Box px={3} pb={4}>
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
