import { Box } from "@mui/system";

import { Image } from "@components/UI/image";
import { UserWrapper } from "./user.styles";
import { Icon } from "@/components/UI/icon";
import { useBoolean } from "@hooks/useBoolean";
import Username from "@modules/account/components/settings/components/personalInfo/components/username/Username";

type Props = {
  image?: string;
  name?: string;
  lvl: string;
};

const User = ({ image, name, lvl }: Props) => {
  const { value: openEditNickName, setTrue, setFalse } = useBoolean();

  return (
    <UserWrapper>
      <Box className="image" mr={2}>
        <Image src={image} alt={name} size="20" />
      </Box>

      <div className="info">
        <p className="c-font-20-24 c-fw-500 c-font-color">{name}</p>
        <p className="c-font-16-22 c-font-color">{lvl}</p>
      </div>

      <Box className="editWrapper" ml={1} onClick={setTrue}>
        <Icon name="pencil" size="19" />
      </Box>

      <Username onClose={setFalse} open={openEditNickName} />
    </UserWrapper>
  );
};

export default User;
