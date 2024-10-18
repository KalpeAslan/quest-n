import { useMemo } from "react";

import { Icon } from "@components/UI/icon";

import {
  BreadcrumbsStyledLink,
  BreadcrumbsStyledLinkP,
  BreadcrumbsStyledList,
} from "./breadcrumbs.styles";
import Script from "next/script";

interface ILink {
  id: number;
  title: string | null;
  link: string | null;
}

type Props = {
  links: ILink[];
};

export const BreadCrumbs = ({ links }: Props) => {
  const activeItems = useMemo(() => {
    return [...links].splice(0, links.length - 1);
  }, [links]);

  return (
    <>
      <Script
        type="application/ld+json"
        id={"breadcrumbs"}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: links.map((link, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@id": link.link,
                name: link.title,
              },
            })),
          }),
        }}
      />
      <BreadcrumbsStyledList>
        {activeItems.map((link: ILink) => (
          <BreadcrumbsStyledLink
            className={"active c-font-14-20"}
            href={`/blog/${link.link}` || "/blog"}
            key={link.id}
          >
            <span>{link.title}</span>

            <Icon name="slider-arrow" size="13" />
          </BreadcrumbsStyledLink>
        ))}

        <BreadcrumbsStyledLinkP className={"c-font-14-20"}>
          <span>{links[links.length - 1].title}</span>
        </BreadcrumbsStyledLinkP>
      </BreadcrumbsStyledList>
    </>
  );
};
