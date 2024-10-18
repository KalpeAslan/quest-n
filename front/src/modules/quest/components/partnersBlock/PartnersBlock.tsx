import { IPartner } from "@/models";
import { FC } from "react";
import { PartnerItem } from "./partnerItem";
import { Wrapper } from "./partnersBlock.styles";
import { Box } from "@mui/material";
import { CustomMarquee } from "@/lib/CustomMarquee";
import { Trans } from "@lingui/macro";

interface Props {
  partners: IPartner[];
}

const PartnersBlock: FC<Props> = ({ partners }) => {
  return (
    <Wrapper>
      <Box
        component="h2"
        className="c-font-color c-font-23-24 c-sm-font-32-38 c-fw-500"
        mb={3}
      >
        <Trans id="6wLY11VBgXM7wmMKDAYBB7-home">Our Partners</Trans>
      </Box>

      <CustomMarquee>
        {partners.map(item => (
          <PartnerItem key={item.id} partner={item} />
        ))}
      </CustomMarquee>
    </Wrapper>
  );
};

export default PartnersBlock;
