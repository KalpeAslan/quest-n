import { Box, Divider } from "@mui/material";

import { PersonalInfo } from "./components/personalInfo";
import { Security } from "./components/security";
import { Delete } from "./components/delete";
import { SettingsWrapper } from "./settings.styles";

const Settings = () => {
  return (
    <SettingsWrapper>
      <PersonalInfo />
      <Box>
        <Divider sx={{ my: 4 }} />
        <Security />
      </Box>
      <Delete />
    </SettingsWrapper>
  );
};

export default Settings;
