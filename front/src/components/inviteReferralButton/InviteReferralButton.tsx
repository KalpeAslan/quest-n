import { Box } from "@mui/system";

import { Icon } from "@components/UI/icon";
import { useAppDispatch } from "../../hooks/useAppDispatch";

import {
  InviteReferralButtonStylesButton,
  InviteReferralButtonStylesIcon,
} from "./inviteReferralButton.styles";
import { setIsInviteReferralsPopupOpen } from "@/modules/account/store/account.slice";

type Props = {
  children: any;
};

const InviteReferralButton = ({ children }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <InviteReferralButtonStylesButton
      onClick={() => {
        dispatch(setIsInviteReferralsPopupOpen(true));
      }}
    >
      <Box mr="auto" ml={0.5}>
        {children}
      </Box>

      <InviteReferralButtonStylesIcon>
        <Icon name="loyalty-add-user" size="24" />
      </InviteReferralButtonStylesIcon>
    </InviteReferralButtonStylesButton>
  );
};

export default InviteReferralButton;
