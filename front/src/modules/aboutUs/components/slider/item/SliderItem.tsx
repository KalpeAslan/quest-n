import { Box } from "@mui/material";
import { StaticImageData } from "next/image";

import { Image } from "@components/UI/image";
import { SliderItemWrapper } from "./sliderItem.styles";

type Props = {
  title: string;
  description: string;
  image: StaticImageData;
};

const Item = ({ title, description, image }: Props) => {
  return (
    <SliderItemWrapper>
      {image && (
        <div className="img">
          <Image src={image.src} alt={title} size="140" isBackground={false} />
        </div>
      )}

      <Box
        className="c-font-20-28 c-fw-500 c-text-center c-font-color"
        component="p"
        mt={{ xs: 2, sm: 3 }}
      >
        {title}
      </Box>

      <Box
        className="c-font-16-22 c-text-center c-font-color-6"
        component="p"
        mt={{ xs: 1, md: 1.75 }}
        mb={{ xs: "auto" }}
      >
        {description}
      </Box>
    </SliderItemWrapper>
  );
};

export default Item;
