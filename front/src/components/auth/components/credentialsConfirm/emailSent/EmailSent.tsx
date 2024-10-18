import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { Link } from "@/components/UI/link";
import { Trans } from "@lingui/macro";
import { Box } from "@mui/material";
import { FC } from "react";

interface Props {
  email: string;
}

const EmailSent: FC<Props> = ({ email }) => {
  const goToEmail = () => {
    if (!window) return;
    window.open("mailto:", "_blank");
  };

  return (
    <Box maxWidth="328px" width="100%">
      <Box
        component="h3"
        className="c-sm-font-32-38 c-fw-500 c-font-color"
        mb="20px"
      >
        <Trans id="dmod8AZWGrqg78xWxxu9au-auth">Confirm email</Trans>
      </Box>

      <Box
        sx={{
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          width: "80px",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          marginBottom: "20px",
        }}
      >
        <Icon width={40} height={40} name="email-sent" />
      </Box>

      <Box
        className="c-font-14-20 c-font-color c-fw-400"
        textAlign="center"
        mb={2.5}
      >
        <Trans id="1kHuk6f1Vjth2Z9upUa8bN-auth">
          To complete follow the link that we&apos;ve sent to your email
        </Trans>{" "}
        {email}
      </Box>

      <Button style="secondary" className="c-full-width" onClick={goToEmail}>
        <Trans id="kUJkL7LjAXxSAKJD4Uq1Fu-auth">Go to Email</Trans>
      </Button>

      <Box
        mt={2.5}
        className="c-font-14-20 c-font-color c-fw-400"
        textAlign="center"
      >
        <Trans id="uDGgWn5GaN9UD1iVybLYhk-auth">
          Didn&apos;t receive email letter?
          <br />
          Please check your spam folder.
          <br />
          Questions?{" "}
          <Link
            href="https://discord.com/invite/S6YgxUfH5S"
            target="_blank"
            rel="noreferrer"
          >
            Contact us at Discord
          </Link>
        </Trans>
      </Box>
    </Box>
  );
};

export default EmailSent;
