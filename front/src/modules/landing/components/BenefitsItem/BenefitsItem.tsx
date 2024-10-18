import { FC } from "react";
import { IBenefit } from "../../pages/Page2/Page2";
import { Wrapper } from "./benefitsItem.styles";
import { Box } from "@mui/material";
import Image from "next/image";

interface Props {
  data: IBenefit;
}

const BenefitsItem: FC<Props> = ({ data }) => {
  return (
    <Wrapper>
      <Box className="benefitImageWrapper">
        <Image
          src={data.image}
          alt={data.title}
          className="benefitImage border-radius-img"
        />
      </Box>

      <Box>
        <Box
          component="h3"
          className="c-font-color c-font-20-24 c-fw-500 benefitTitle"
        >
          {data.title}
        </Box>

        <Box
          component="p"
          className="c-font-color c-font-15-18 c-md-font-16-22 c-fw-400 benefitDescription"
        >
          {data.description}
        </Box>
      </Box>
    </Wrapper>
  );
};

export default BenefitsItem;
