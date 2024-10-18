import { Box, Theme, useMediaQuery } from "@mui/material";
import { FC } from "react";
import { INotification } from "@store/slices/notifications/notifications.slice";
import Icon from "@components/UI/icon/Icon";
import { Trans } from "@lingui/macro";
import { CBreakpoints } from "@styles/variables";
import { useRouter } from "next/router";
import classNames from "classnames";

export const NotificationsItem: FC<{ data: INotification }> = ({
  data: { type, title, payload, viewed },
}) => {
  const computeIconName = () => {
    if (type === "scoreboard" || type === "luckyDraw")
      return `notification_${type}`;
    if (type === "experience") return "notification_exp";
    return "notification_main";
  };

  const renderBody = () => {
    const descriptionColor = viewed
      ? "rgba(250, 250, 250, 0.60)"
      : "var(--text-color-2)";

    const titleColor = viewed ? "var(--text-color-2)" : "var(--color-gr2)";

    if (type === "update")
      return (
        <>
          <p
            className={"c-font-12-14"}
            style={{
              color: descriptionColor,
            }}
          >
            <Trans id={"wertyui-kjhg-vbhj-213"}>Our platform update.</Trans>
          </p>
          <p
            className={"c-font-12-14"}
            style={{
              color: titleColor,
            }}
          >
            <Trans id={"cvbndfghjhg-qwev-124"}>Find out more</Trans>
          </p>
        </>
      );

    return (
      <>
        <p style={{ color: titleColor }} className={"c-font-12-14"}>
          {title}
        </p>
        <p
          style={{ color: descriptionColor }}
          className={"c-font-color c-font-12-14"}
        >
          {payload.message}
        </p>
      </>
    );
  };

  const isSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.sm),
  );

  const { push } = useRouter();

  const handleClick = () => {
    if (payload.questLinkTitle) return push(`/quest/${payload.questLinkTitle}`);
    if (type === "experience") return push("/profile/experience");
  };

  return (
    <Box
      color={viewed ? "rgba(250, 250, 250, 0.30)" : "var(--color-gr2)"}
      className={classNames(
        "c-flex-items-center is-content-justification-center",
        {
          "c-pointer": payload.questLinkTitle,
        },
      )}
      onClick={handleClick}
    >
      <Icon name={computeIconName()} size={isSm ? "16" : "22"} />
      <Box ml={1}>{renderBody()}</Box>
    </Box>
  );
};
