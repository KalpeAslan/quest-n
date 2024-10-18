import { Icon } from "@components/UI/icon";
import { Speaker } from "@models";
import {
  SpeakerItemStylesBottomWrapper,
  SpeakerItemStylesContent,
  SpeakerItemStylesImageWrapper,
  SpeakerItemStylesItem,
  SpeakerItemStylesItemIcon,
  SpeakerItemStylesItemImage,
  SpeakerItemStylesLogo,
  SpeakerItemStylesName,
  SpeakerItemStylesPosition,
  SpeakerItemStylesProjectLink,
  SpeakerItemStylesSocItem,
  SpeakerItemStylesSocLink,
  SpeakerItemStylesSocList,
  SpeakerItemStylesTitle,
  SpeakerItemStylesTopWrapper,
} from "./speakerItem.styles";

type Props = {
  data: Speaker;
};

const SpeakerItem = ({
  data: { image, name, position, project, socLinks },
}: Props) => {
  return (
    <SpeakerItemStylesItem>
      <SpeakerItemStylesImageWrapper>
        <SpeakerItemStylesItemImage
          className={"lazyload"}
          src={image}
          alt="speaker image"
        />
      </SpeakerItemStylesImageWrapper>

      <SpeakerItemStylesContent>
        <SpeakerItemStylesTopWrapper>
          <SpeakerItemStylesTitle>
            <SpeakerItemStylesName>{name}</SpeakerItemStylesName>

            {project && project.link && project.logo && (
              <SpeakerItemStylesLogo
                href={project.link}
                target="_blank"
                rel="noreferrer"
              >
                <SpeakerItemStylesItemIcon
                  className="lazyload"
                  src={project.logo}
                  alt="speaker icon"
                />
              </SpeakerItemStylesLogo>
            )}
          </SpeakerItemStylesTitle>

          <SpeakerItemStylesPosition>{position}</SpeakerItemStylesPosition>
        </SpeakerItemStylesTopWrapper>

        <SpeakerItemStylesBottomWrapper>
          <SpeakerItemStylesSocList>
            {socLinks.linkedin && (
              <SpeakerItemStylesSocItem>
                <SpeakerItemStylesSocLink
                  href={socLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="linkedin" />
                </SpeakerItemStylesSocLink>
              </SpeakerItemStylesSocItem>
            )}

            {socLinks.twitter && (
              <SpeakerItemStylesSocItem>
                <SpeakerItemStylesSocLink
                  href={socLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="twitter" />
                </SpeakerItemStylesSocLink>
              </SpeakerItemStylesSocItem>
            )}
          </SpeakerItemStylesSocList>

          {project && project.link && project.name && (
            <SpeakerItemStylesProjectLink
              href={project.link}
              target="_blank"
              rel="noreferrer"
            >
              {project.name}
            </SpeakerItemStylesProjectLink>
          )}
        </SpeakerItemStylesBottomWrapper>
      </SpeakerItemStylesContent>
    </SpeakerItemStylesItem>
  );
};

export default SpeakerItem;
