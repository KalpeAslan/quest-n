import { Box } from "@mui/material";
import { TwoFactorAuth } from "./components/twoFactorAuth";

const Security = () => {
  return (
    <>
      <Box mb={3}>
        <TwoFactorAuth />
      </Box>
    </>
  );
};

export default Security;
