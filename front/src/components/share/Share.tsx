import { useState } from "react";
import { Box } from "@mui/material";
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
} from "react-share";

import { Icon } from "@components/UI/icon";
import { Modal } from "@components/UI/modal";
import { ModalStyled, Wrapper } from "./share.styles";
import { Trans } from "@lingui/macro";
import CopyToClipboard from "react-copy-to-clipboard";

type Props = {
  url: string;
};

const Share = ({ url }: Props) => {
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  return (
    <div
      className="c-font-color"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Wrapper onClick={() => setPopupOpen(true)}>
        <Icon name="share" height="24" width="24" />

        <Box component="p" ml={0.5} className="c-font-16-22">
          <Trans id="k1Q9ja9zbKaNFDH71CDd9A-share">Share</Trans>
        </Box>
      </Wrapper>

      <Modal
        isOpen={popupOpen}
        handleClose={() => {
          setPopupOpen(false);
        }}
      >
        <ModalStyled className="c-font-color">
          <header className="header">
            <p>
              <Trans id="fJWwcwvGAoMksj1bBa5HVf-share">Share</Trans>
            </p>

            <Box className="icon" ml="auto">
              <Icon
                name="menu-close"
                size="24"
                onClick={() => setPopupOpen(false)}
              />
            </Box>
          </header>

          <Box className="content" onClick={() => setPopupOpen(false)}>
            <CopyToClipboard text={url}>
              <button className="icon">
                <Icon name="link" size="24" />

                <span>
                  <Trans id="6BPBBYrZoQnXnZQ8CgyTjX-share">Copy link</Trans>
                </span>
              </button>
            </CopyToClipboard>

            <TwitterShareButton className="icon" url={url}>
              <Icon name="twitter" size="24" />

              <span>
                <Trans id="ja6gJmpQtHgNLrfNrZnZ75-share">
                  Share on Twitter
                </Trans>
              </span>
            </TwitterShareButton>

            <FacebookShareButton className="icon" url={url}>
              <Icon name="facebook" size="24" />

              <span>
                <Trans id="57iDdj85nMvNkSsGGFo6wQ-share">
                  Share on Facebook
                </Trans>
              </span>
            </FacebookShareButton>

            <LinkedinShareButton className="icon" url={url}>
              <Icon name="linkedin" size="24" />

              <span>
                <Trans id="1c7SdXfjnrfwS55nME1pXd-share">
                  Share on Linkedin
                </Trans>
              </span>
            </LinkedinShareButton>

            <RedditShareButton className="icon" url={url}>
              <Icon name="reddit" size="24" />

              <span>
                <Trans id="kzsV7FcSkak1Mc1cxdrjYV-share">Share on Reddit</Trans>
              </span>
            </RedditShareButton>
          </Box>
        </ModalStyled>
      </Modal>
    </div>
  );
};

export default Share;
