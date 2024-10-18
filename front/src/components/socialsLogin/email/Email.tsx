import { Button } from "@components/UI/button";
import { Box } from "@mui/material";
import { useState } from "react";

type Props = {
  className?: string;
  text?: string;
  isSocialLoaded?: boolean;
  clickInitFn?: any;
  iframeAuthPopup?: boolean;
};

const EmailLogin = ({
  isSocialLoaded,
  className,
  text,
  clickInitFn,
  iframeAuthPopup,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);

  const onClick = () => {
    if (clickInitFn) {
      clickInitFn();
    }

    setIsLoaded(false);
  };

  return (
    <Button
      style={iframeAuthPopup ? "secondary" : "primary"}
      size="task"
      type="button"
      className={className}
      loading={!isLoaded || !isSocialLoaded}
      disabled={!isLoaded || !isSocialLoaded}
      onClick={onClick}
    >
      <Box component="span" ml={1}>
        {text}
      </Box>
    </Button>
  );
};

export default EmailLogin;
