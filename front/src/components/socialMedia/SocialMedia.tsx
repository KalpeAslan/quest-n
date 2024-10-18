// @ts-nocheck
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { Icon } from "../UI/icon";

import { SocialMediaStylesList } from "./socialMedia.styles";

type Props = {
  size?: string | null;
  instagram?: string | null;
  telegram?: string | null;
  discord?: string | null;
  twitter?: string | null;
  web?: string | null;
  facebook?: string | null;
  reddit?: string | null;
  youtube?: string | null;
  medium?: string | null;
  github?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
  align?: string;
  type?: string;
};

const SocialMedia = ({
  size,
  instagram,
  telegram,
  discord,
  twitter,
  web,
  facebook,
  reddit,
  youtube,
  medium,
  github,
  linkedin,
  tiktok,
  align,
  type,
}: Props) => {
  const dispatch = useAppDispatch();

  const onClick = (url: string, source: string) => () => {
    if (typeof window === "undefined") return;

    dispatch(
      sendAnalyticsDataThunk({
        type: "quest_share_tap",
        options: { event_property_quest_share_source: source },
      }),
    );

    window.open(url, "_blank");
  };

  return (
    <SocialMediaStylesList align={align} className={"c-flex"}>
      {web && (
        <li>
          <button onClick={onClick(web, "web")}>
            <Icon className="c-vertical-middle" size={size} name="web" />
          </button>
        </li>
      )}

      {instagram && (
        <li>
          <button onClick={onClick(instagram, "instagram")}>
            <Icon className="c-vertical-middle" size={size} name="instagram" />
          </button>
        </li>
      )}

      {telegram && (
        <li>
          <button onClick={onClick(telegram, "telegram")}>
            <Icon className="c-vertical-middle" size={size} name="telegram" />
          </button>
        </li>
      )}

      {discord && (
        <li>
          <button onClick={onClick(discord, "discord")}>
            <Icon className="c-vertical-middle" size={size} name="discord" />
          </button>
        </li>
      )}

      {twitter && (
        <li>
          <button onClick={onClick(twitter, "twitter")}>
            <Icon className="c-vertical-middle" size={size} name="twitter" />
          </button>
        </li>
      )}

      {facebook && (
        <li>
          <button onClick={onClick(facebook, "facebook")}>
            <Icon className="c-vertical-middle" size={size} name="facebook" />
          </button>
        </li>
      )}

      {reddit && (
        <li>
          <button onClick={onClick(reddit, "reddit")}>
            <Icon className="c-vertical-middle" size={size} name="reddit" />
          </button>
        </li>
      )}

      {github && (
        <li>
          <button onClick={onClick(github, "github")}>
            <Icon className="c-vertical-middle" size={size} name="github" />
          </button>
        </li>
      )}

      {linkedin && (
        <li>
          <button onClick={onClick(linkedin, "linkedin")}>
            <Icon className="c-vertical-middle" size={size} name="linkedin" />
          </button>
        </li>
      )}

      {youtube && (
        <li>
          <button onClick={onClick(youtube, "youtube")}>
            <Icon className="c-vertical-middle" size={size} name="youtube" />
          </button>
        </li>
      )}

      {medium && (
        <li>
          <button onClick={onClick(medium, "medium")}>
            <Icon
              className="c-vertical-middle"
              height={size}
              width={+size + 8}
              name="medium"
            />
          </button>
        </li>
      )}

      {tiktok && (
        <li>
          <button onClick={onClick(tiktok, "tiktok")}>
            <Icon
              className="c-vertical-middle"
              height={size}
              width={+size + 8}
              name="tiktok"
            />
          </button>
        </li>
      )}
    </SocialMediaStylesList>
  );
};

export default SocialMedia;
