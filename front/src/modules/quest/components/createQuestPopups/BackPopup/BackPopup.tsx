import { Modal } from "@/components/UI/modal";
import { Dispatch, FC, SetStateAction } from "react";
import { Wrapper } from "./backPopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { ECreateQuestSteps } from "@/modules/quest/models";
import { Trans } from "@lingui/macro";

interface Props {
  backStep: ECreateQuestSteps | null;
  setBackStep: Dispatch<SetStateAction<ECreateQuestSteps | null>>;
  setStep: Dispatch<SetStateAction<ECreateQuestSteps>>;
}

const BackPopup: FC<Props> = ({ backStep, setBackStep, setStep }) => {
  return (
    <>
      {Boolean(backStep) && (
        <Modal isOpen={true} handleClose={() => setBackStep(null)}>
          <Wrapper>
            <Box className="header c-fw-500 c-font-color">
              <Trans id="cnZ2X7h2vS6Umuep9WV9bq-quest">
                Return to the previous step
              </Trans>
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={() => setBackStep(null)}
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Box>

            <Box p={3}>
              <Box
                component="p"
                className="c-font-16-22 c-font-color"
                textAlign="center"
                mb={3}
              >
                <Trans id="vbUMo1uiA417PLq3Hw6fDZ-quest">
                  You have unsaved progress. If you return to the previous one,
                  it will be lost
                </Trans>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Button
                  style="secondary"
                  className="c-full-width btn mr"
                  onClick={() => {
                    setStep(backStep);
                    setBackStep(null);
                  }}
                >
                  <>
                    <span className="desktop">
                      <Trans id="5iDLNBAqVBremFkQYciqRV-quest">
                        Return without saving
                      </Trans>
                    </span>
                    <span className="mobile">
                      <Trans id="bSh4sLWtQfosKkuMJFzwGT-quest">
                        Don&apos;t save
                      </Trans>
                    </span>
                  </>
                </Button>

                <Button
                  style="colorfull"
                  className="c-full-width btn"
                  onClick={() => setBackStep(null)}
                >
                  <Trans id="89NrPP4Rchpu7T3DuY43q6-quest">Cancel</Trans>
                </Button>
              </Box>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default BackPopup;
