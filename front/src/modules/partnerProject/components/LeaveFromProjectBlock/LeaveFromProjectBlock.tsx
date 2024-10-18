import { useState } from "react";
import { Box } from "@mui/material";
import Button from "../../../../components/UI/button/Button";
import { LeaveFromPartnerProjectPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/LeaveFromPartnerProjectPopup";
import { Icon } from "@components/UI/icon";
import { Trans } from "@lingui/macro";
import { CBreakpoints } from "@styles/variables";

interface IProps {
  projectLink: string;
}

export const LeaveFromProjectBlock = ({ projectLink }: IProps) => {
  const [showLeaveFromProjectPopup, setShowLeaveFromProjectPopup] =
    useState<boolean>(false);
  return (
    <Box
      position={"relative"}
      sx={theme => ({
        [theme.breakpoints.up(CBreakpoints.md)]: {
          pl: 3,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "1px",
            height: "100%",
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.10)",
            opacity: 0.5,
          },
        },
      })}
      paddingLeft={3}
    >
      <p className={"c-font-color c-fw-500 c-font-20-22"}>
        This is a delegated project
      </p>

      <Box
        mt={3}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"left"}
        width={"100%"}
      >
        <Button
          style={"secondary"}
          size={"task"}
          onClick={() => setShowLeaveFromProjectPopup(true)}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={"10px"}
          >
            <Icon className={"c-font-color-4"} name={"leave"} size={"24"} />
            <Trans id={"1poiuytf-vbnkadwr-dklb34-dbdfb99"}>Leave Project</Trans>
          </Box>
        </Button>
      </Box>

      <LeaveFromPartnerProjectPopup
        onClose={() => setShowLeaveFromProjectPopup(false)}
        isOpen={showLeaveFromProjectPopup}
        projectLinkTitle={projectLink}
      />
    </Box>
  );
};
