import { Box, Divider } from "@mui/material";

import { PersonalInfo } from "./components/personalInfo";
import { SettingsWrapper } from "./settings.styles";

const Settings = () => {
  return (
    <SettingsWrapper>
      <PersonalInfo />
      <Box>
        <Divider sx={{ my: 4 }} />
      </Box>
    </SettingsWrapper>
  );
};

export default Settings;
