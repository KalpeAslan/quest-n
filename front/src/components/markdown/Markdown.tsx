import classnames from "classnames";
import { ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkUnwrapImages from "remark-unwrap-images";

import { Button } from "../UI/button";
import { Icon } from "../UI/icon";
import { SocialMedia } from "../socialMedia";
import { Wrapper } from "@components/markdown/markdown.styles";
import Link from "next/link";
import { appConfig } from "@/app.config";
import Image from "next/image";

type Props = {
  children: string;
};

const Markdown = ({ children }: Props) => {
  const customImageBlock = ({ src, alt }: any): ReactElement => {
    const fullUrl = `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${src}`;

    return (
      <Image
        title={alt}
        className="lazyload"
        width={100}
        height={100}
        src={fullUrl}
        alt={alt}
      />
    );
  };

  const customSection = ({ className, children }: any) => {
    return <section className={className}>{children}</section>;
  };

  const customDiv = ({ className, children }: any) => {
    return <div className={className}>{children}</div>;
  };

  const customP = ({ children }: any) => {
    return <div>{children}</div>;
  };

  const customText = ({ children }: any) => {
    let data = null;

    try {
      data = JSON.parse(children[0]);
    } catch (error) {
      console.log("Parsing error");
    }

    if (data) {
      const { tag, classname, text } = data;

      if (tag === "p") {
        return <p className={classnames({ [classname]: classname })}>{text}</p>;
      }
    }
  };

  const customA = ({ children }: any) => {
    const { type, href, title } = JSON.parse(children[0]);

    if (!(type && href && title)) {
      return "";
    }

    if (type === "link") {
      return (
        <Link className={"link"} rel="noreferrer" target="_blank" href={href}>
          {title}
        </Link>
      );
    }

    if (type === "button") {
      return (
        <Button
          className="c-button"
          style="primary"
          href={href}
          target="_blank"
        >
          {title}
        </Button>
      );
    }

    if (type === "apple-store") {
      return (
        <Button className="c-button" style="store" href={href} target="_blank">
          <Icon name="apple-store" height="40" width="136" />
        </Button>
      );
    }

    if (type === "google-store") {
      return (
        <Button className="c-button" style="store" href={href} target="_blank">
          <Icon name="google-store" height="40" width="136" />
        </Button>
      );
    }
  };

  const customSoc = ({ children }: any) => {
    let data = null;

    try {
      data = JSON.parse(children[0]);
    } catch (error) {
      console.log("Parsing error");
    }

    if (data) {
      return (
        <div className={"soc"}>
          <SocialMedia
            size="20"
            web={data.projectSite}
            instagram={data.instagram}
            telegram={data.telegram}
            discord={data.discord}
            twitter={data.twitter}
            facebook={data.facebook}
            reddit={data.reddit}
            github={data.github}
            linkedin={data.linkedin}
            youtube={data.youtube}
            medium={data.medium}
            tiktok={data.tiktok}
          />
        </div>
      );
    }
  };

  return (
    <Wrapper>
      <ReactMarkdown
        className="markdown"
        remarkPlugins={[
          remarkDirective,
          remarkDirectiveRehype,
          remarkUnwrapImages,
        ]}
        components={{
          img: customImageBlock,
          div: customDiv,
          section: customSection,
          text: customText as any,
          p: customP as any,
          a: customA as any,
          abbr: customSoc as any,
        }}
        unwrapDisallowed
      >
        {children}
      </ReactMarkdown>
    </Wrapper>
  );
};

export default Markdown;
