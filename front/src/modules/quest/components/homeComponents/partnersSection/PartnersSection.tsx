import { Box } from "@mui/material";
import { Wrapper } from "./partnersSection.styles";
import Image from "next/image";
import { IPartner } from "@/models";
import { FC } from "react";
import { Trans } from "@lingui/macro";

interface Props {
  partners: IPartner[];
}

const PartnersSection: FC<Props> = ({ partners }) => {
  return (
    <Wrapper>
      <Box
        component="h2"
        className="c-font-28-40 c-sm-font-32-45 c-md-font-40-56 c-fw-500 title"
      >
        <Trans id="oJvFqWdoRzFzATh2sNaV5u-home">Trusted by</Trans>
      </Box>

      <Box className="partnerItems">
        {partners.map(item => (
          <Box
            component="a"
            key={item.id}
            href={item.link}
            target="_blank"
            className="partnerItem"
          >
            <Image
              src={item.image}
              alt={item.title}
              height={20}
              width={50}
              className="image"
            />
          </Box>
        ))}
      </Box>
    </Wrapper>
  );
};

export default PartnersSection;
