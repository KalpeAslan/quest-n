import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import { Modal } from "@components/UI/modal";
import { Button } from "@components/UI/button";
import { InviteRefForm } from "@components/inviteRefForm";
import {
  InviteReferralPopupStylesContent,
  InviteReferralPopupStylesHeader,
  InviteReferralPopupStylesTitle,
  InviteReferralPopupStylesWrapper,
} from "./inviteReferralsPopup.styles";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setIsInviteReferralsPopupOpen } from "@/modules/account/store/account.slice";

const InviteReferralsPopup = () => {
  const isInviteReferralsPopupOpen = useTypedSelector(
    state => state.account.isInviteReferralsPopupOpen,
  );
  const dispatch = useAppDispatch();

  return (
    <>
      {isInviteReferralsPopupOpen && (
        <Modal
          isOpen={true}
          handleClose={() => {
            dispatch(setIsInviteReferralsPopupOpen(false));
          }}
        >
          <InviteReferralPopupStylesWrapper>
            <InviteReferralPopupStylesHeader>
              <InviteReferralPopupStylesTitle
                className="c-font-24-26 c-fw-500 c-font-color"
                component="p"
              >
                <Trans id="eg7jWfRtjgN23G7QrHbYiN-inviteReferralsPopup">
                  Invite Referrals
                </Trans>
              </InviteReferralPopupStylesTitle>

              <Button
                className="c-font-color"
                style="icon"
                type="button"
                onClick={() => {
                  dispatch(setIsInviteReferralsPopupOpen(false));
                }}
                disableTouchStart
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </InviteReferralPopupStylesHeader>

            <InviteReferralPopupStylesContent>
              <Box className="c-font-16-22 c-font-color" component="p" mb={3}>
                <Trans id="6EXm1XsEdqvygw94anNd7Q-inviteReferralsPopup">
                  To invite new AlphaGuilty users and increase your referral
                  income, share this information.
                </Trans>
              </Box>

              <InviteRefForm />
            </InviteReferralPopupStylesContent>
          </InviteReferralPopupStylesWrapper>
        </Modal>
      )}
    </>
  );
};

export default InviteReferralsPopup;
