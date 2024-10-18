import accessImage from "@assets/images/global-event/access.webp";
import { Trans } from "@lingui/macro";

import {
  AccessModuleAccess,
  AccessModuleAccessImage,
  AccessModuleCaption,
  AccessModuleAccessButton,
  AccessModuleImageWrapper,
  AccessModuleText,
} from "./access.styles";

type Props = {
  text: string;
  buttonName: string;
  buttonLink: string;
};

const EventAccessSection = ({ text, buttonName, buttonLink }: Props) => {
  return (
    <AccessModuleAccess>
      <AccessModuleCaption>
        <Trans id="f7Umt41vPP4yZsycGf9YBp-events">
          Get access to the $ALPHAG token sale!
        </Trans>
      </AccessModuleCaption>

      <AccessModuleImageWrapper>
        <AccessModuleAccessImage
          className="access-image lazyload"
          src={accessImage}
          alt="access image"
        />
      </AccessModuleImageWrapper>

      <AccessModuleText>{text}</AccessModuleText>

      <AccessModuleAccessButton
        style="primary"
        type="button"
        href={buttonLink}
        target="_blank"
      >
        {buttonName}
      </AccessModuleAccessButton>
    </AccessModuleAccess>
  );
};

export default EventAccessSection;
