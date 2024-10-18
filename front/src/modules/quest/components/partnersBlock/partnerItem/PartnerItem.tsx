import { IPartner } from "@/models";
import { Wrapper } from "./partnerItem.styled";
import { FC } from "react";
import { Box } from "@mui/material";
import Image from "next/image";

interface Props {
  partner: IPartner;
}

const PartnerItem: FC<Props> = ({ partner }) => {
  return (
    <Wrapper href={partner.link} target="_blank">
      <Box className="logoWrapper">
        <Image src={partner.image} alt={partner.title} className="logo" fill />
      </Box>

      <Box
        className="c-font-color c-font-16-22 c-fw-500"
        mr="6px"
        sx={{ whiteSpace: "nowrap" }}
      >
        {partner.title}
      </Box>

      <Box
        className="c-font-14-20 c-fw-400 c-font-color"
        sx={{ opacity: 0.5, whiteSpace: "nowrap" }}
      >
        {partner.description}
      </Box>

      <Box className="divider" />
    </Wrapper>
  );
};

export default PartnerItem;
