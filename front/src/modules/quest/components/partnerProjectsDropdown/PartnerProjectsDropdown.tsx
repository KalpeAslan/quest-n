import { PartnerProjectsDropdownStyles } from "@modules/quest/components/partnerProjectsDropdown/PartnerProjectsDropdown.styles";
import { Box, Divider } from "@mui/material";
import { Icon } from "@components/UI/icon";
import { Trans } from "@lingui/macro";
import { useState } from "react";
import { PartnerProjectAdmin } from "@modules/quest/models";
import Image from "next/image";
import { appConfig } from "@/app.config";
import { useRouter } from "next/router";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import { useGetProfileProjectsQuery } from "@modules/account/store/account.api";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getIsAdminCreatePageOpened } from "@/store/slices/system/system.selector";
import { setChangesWarningPopupPath } from "@/store/slices/system/system.slice";

export const PartnerProjectsDropdown = () => {
  const useGetProfileProjectsQuery1 = useGetProfileProjectsQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const data =
    (useGetProfileProjectsQuery1.data as PartnerProjectAdmin[]) || [];

  const dispatch = useAppDispatch();

  const adminCreatePageOpened = useTypedSelector(getIsAdminCreatePageOpened);

  const { query, asPath, push } = useRouter();
  // const linkTitle = query.id
  const [open, setOpen] = useState<boolean>(false);

  const renderList = () => {
    const isSelected = (item: PartnerProjectAdmin, index: number) => {
      if (asPath === "/admin/projects" && index === 0) return true;
      return false;
    };

    return (
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"start"}
        width={"100%"}
        top={-20}
        borderRadius={"0px 0px 10px 10px"}
        padding={"19px 15px 20px 15px"}
        position={"relative"}
        bgcolor={"rgba(255, 255, 255, 0.03)"}
      >
        {data.map((item, index) => (
          <Box key={index} width={"100%"}>
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={1}
              width={"100%"}
              justifyContent={"left"}
              py={1.5}
              className={"c-pointer"}
              onClick={() => {
                if (adminCreatePageOpened) {
                  dispatch(
                    setChangesWarningPopupPath(
                      `/admin/project/${item.linkTitle}`,
                    ),
                  );

                  return;
                }

                push(`/admin/project/${item.linkTitle}`);
              }}
            >
              <Box>
                <Image
                  width={20}
                  height={20}
                  style={{borderRadius: "50%"}}
                  src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${item.logo}`}
                  alt={item.name}
                />
                {item.verificationIcon && (
                  <Icon
                    className="icon"
                    name={"quest-check-mark"}
                    size="20"
                    style={{ position: "absolute", bottom: 0, right: 0 }}
                  />
                )}
              </Box>
              <Box
                className={classNames("c-font-14-16 c-fw-400", {
                  "c-font-color-3": isSelected(item, index),
                  "c-font-color": !isSelected(item, index),
                })}
              >
                {item.name}
              </Box>
            </Box>
            {index !== data.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <PartnerProjectsDropdownStyles.Wrapper>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        p={1}
        bgcolor={open ? "#18231C" : "transparent"}
        borderRadius={2}
        onClick={() => setOpen(!open)}
        position={"relative"}
        zIndex={3}
        className={"c-font-color-3 c-pointer"}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Icon name="account-main-activity" size="24" />
          <Box ml={1.2} component={"p"} className={"c-font-14-16 c-fw-400"}>
            <Trans id={"ldfb-34lndfb-dflknbd-3lnb"}>Projects</Trans>
          </Box>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            [".partner-projects-dropdown_icon"]: {
              transform: `rotate(${open ? 0 : 180}deg)`,
              transition: "transform 0.2s",
            },
          }}
        >
          <Icon
            className={"partner-projects-dropdown_icon"}
            name={"chevron-bottom"}
            size={"24"}
          />
        </Box>
      </Box>

      <Box position={"relative"} zIndex={2}>
        <CSSTransition
          in={open}
          timeout={500}
          classNames={"partner-projects-dropdown"}
          unmountOnExit
        >
          {renderList()}
        </CSSTransition>
      </Box>
    </PartnerProjectsDropdownStyles.Wrapper>
  );
};
