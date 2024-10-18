import { Box } from "@mui/material";

import { Icon } from "@components/UI/icon";
import { Modal } from "@components/UI/modal";
import { Button } from "@components/UI/button";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  ReferralPopupResultStylesWrapper,
  ReferralPopupResultStylesTitle,
  ReferralPopupResultStylesHeader,
  ReferralPopupResultStylesFooter,
  ReferralPopupResultStylesContent,
} from "./referralPopupResult.styles";
import { setIsReferralPopupResultOpen } from "@/modules/account/store/account.slice";
import { t, Trans } from "@lingui/macro";

const ReferralPopupResult = () => {
  const isReferralPopupResultOpen = useTypedSelector(
    state => state.account.isReferralPopupResultOpen,
  );
  const dispatch = useAppDispatch();

  return (
    <>
      {isReferralPopupResultOpen && (
        <Modal
          isOpen={true}
          handleClose={() => {
            dispatch(setIsReferralPopupResultOpen(null));
          }}
        >
          <ReferralPopupResultStylesWrapper>
            <ReferralPopupResultStylesHeader>
              <ReferralPopupResultStylesTitle
                className={"c-font-24-26 c-fw-500 c-font-color"}
                component="p"
              >
                {isReferralPopupResultOpen.type === "success"
                  ? t({
                      id: "4q8JqPwaWoSXaNQVmDbeTt-referralPopupResult",
                      message: "Start earning",
                    })
                  : t({
                      id: "vaBZ8mCHX8Mbyp7BTu3w11-referralPopupResult",
                      message: "Referral invite error",
                    })}
              </ReferralPopupResultStylesTitle>

              <Button
                className="c-font-color"
                style="icon"
                type="button"
                onClick={() => {
                  dispatch(setIsReferralPopupResultOpen(null));
                }}
                disableTouchStart
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </ReferralPopupResultStylesHeader>

            <ReferralPopupResultStylesContent>
              <Box className="c-font-16-22 c-font-color" component="p" mb={3}>
                {isReferralPopupResultOpen.type === "success"
                  ? t({
                      id: "mDP6sy9dcJMmjqk5Dsra6f-referralPopupResult",
                      message:
                        "Congratulations, you have successfully joined the referral program",
                    })
                  : t({
                      id: "7H5kX1Ak2Pad8jziJ9wGUM-referralPopupResult",
                      message:
                        "Your attempt to join the referral program is unsuccessful. Try to start your own program and invite friends.",
                    })}
              </Box>

              <ReferralPopupResultStylesFooter>
                <Button
                  className="c-font-color"
                  style="colorfull"
                  type="button"
                  onClick={() => {
                    dispatch(setIsReferralPopupResultOpen(null));
                  }}
                  disableTouchStart
                >
                  <div>
                    <Trans id="qcRs95oEsHrbVNstG7JLWw-referralPopupResult">
                      OK
                    </Trans>
                  </div>
                </Button>
              </ReferralPopupResultStylesFooter>
            </ReferralPopupResultStylesContent>
          </ReferralPopupResultStylesWrapper>
        </Modal>
      )}
    </>
  );
};

export default ReferralPopupResult;
