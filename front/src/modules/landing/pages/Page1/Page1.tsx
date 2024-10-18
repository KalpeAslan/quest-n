import { Box } from "@mui/material";
import { Wrapper } from "./page1.styles";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { page1ImageMobile, page1ImageDesktop } from "../../assets";
import Image from "next/image";
import { useRouter } from "next/router";
import { Trans, t } from "@lingui/macro";

const Page1 = () => {
  const router = useRouter();

  return (
    <div className="background-other">
      <Wrapper>
        <Box
          component="h1"
          textAlign="center"
          className="c-font-30-33 c-md-font-54-58 c-fw-500 c-font-color title"
        >
          <Trans id="gS25CB1gGsidmAPVdJkGK8-landing">
            <span className="decoratedBlock">
              <span className="decoratedText">Earn crypto </span>
              <Icon name="landing-decorator" className="decorator" />
            </span>
            <span>by completing simple tasks and social media activity</span>
          </Trans>
        </Box>
        <Box
          component="p"
          textAlign="center"
          className="c-font-22-25 c-md-font-32-38 c-fw-500 c-font-color-3 subTitle"
        >
          <Trans id="3dkqSNXKY9Bc1LecA5Dong-landing">
            Register now and get crypto easily
          </Trans>
        </Box>

        <Button
          style="colorfull"
          className="button c-fw-500 c-font-20-22"
          onClick={() => router.push("/sign-up")}
        >
          <Trans id="nbBoUbmuCqHJq3tajLeyfL-landing">Start earning</Trans>
        </Button>

        <Box className="imageWrapper">
          <Image
            src={page1ImageMobile}
            alt={t({ id: "ajkRBToPe87vcobmYFtW3p-landing", message: "Quests" })}
            className="imageMobile"
          />
          <Image
            src={page1ImageDesktop}
            alt="Quests"
            className="imageDesktop"
          />
        </Box>
      </Wrapper>
    </div>
  );
};

export default Page1;
