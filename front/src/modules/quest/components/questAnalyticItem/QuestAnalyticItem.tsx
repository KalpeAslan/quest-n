import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import Image from "next/image";

interface IProps {
  type: "visitors" | "participants" | "conversions";
  value: number | string;
}

export const QuestAnalyticItem = ({ value, type }: IProps) => {
  const { image, title, background, size, top } = (() => {
    switch (type) {
      case "visitors":
        return {
          image: "/images/analytics/visitors.svg",
          title: <Trans id={"jlnsd-b43jkbdvbd-bdn-bm"}>Visitors</Trans>,
          background:
            "linear-gradient(145deg, rgba(135, 246, 150, 0.30) 4.67%, rgba(71, 192, 88, 0.12) 98.09%)",
          size: 200,
          top: -48,
        };
      case "participants":
        return {
          image: "/images/analytics/participants.svg",
          title: <Trans id={"ndf-b43dnfm-b-dfbgfnbl"}>Participants</Trans>,
          background:
            "linear-gradient(145deg, rgba(135, 219, 246, 0.30) 4.67%, rgba(71, 120, 192, 0.12) 98.09%)",
          size: 130,
          top: -10,
        };
      case "conversions":
        return {
          image: "/images/analytics/conversions.svg",
          title: <Trans id={"bfdkbl2-wlnfdbd-sdfsdf-dfgfn3-dfbl-324n"}>Conversion rate</Trans>,
          background:
            "linear-gradient(145deg, rgba(184, 135, 246, 0.30) 4.67%, rgba(146, 71, 192, 0.12) 98.09%)",
          size: 150,
          top: -20,
        };
    }
  })();

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"start"}
      sx={{
        background,
        [".quest-analytic__image"]: {
          position: "absolute",
          right: 0,
          top,
          bottom: 0,
        },
      }}
      width={"100%"}
      position={"relative"}
      borderRadius={"10px"}
      overflow={"hidden"}
      padding={"25px 15px"}
      height={98}
    >
      <Box>
        <p className={"title c-font-color c-font-26-26 c-fw-500"}>{value}</p>
        <p className={"value c-font-color c-font-16-18 c-fw-500"}>{title}</p>
      </Box>
      <Image
        className={"quest-analytic__image"}
        src={image}
        alt={type}
        width={size}
        height={size}
      />
    </Box>
  );
};
