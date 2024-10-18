import { FC, useMemo } from "react";
import classnames from "classnames";

import { Icon } from "@components/UI/icon";
import { Wrapper } from "./breadCrumbs.styles";
import Link from "next/link";

interface ILink {
  id: number;
  title: string | null | undefined;
  link: string | null;
}

interface BreadCrumbsProps {
  links: ILink[];
}

const BreadCrumbs: FC<BreadCrumbsProps> = ({ links }) => {
  const activeItems = useMemo(() => {
    return [...links].splice(0, links.length - 1);
  }, [links]);

  return (
    <Wrapper>
      {activeItems.map((link: ILink) => (
        <Link
          href={link.link || ""}
          className={classnames("link", "active", "c-font-14-20")}
          key={link.id}
        >
          <span>{link.title}</span>

          <Icon name="slider-arrow" size="13" />
        </Link>
      ))}

      <p className={classnames("link", "c-font-14-20")}>
        <span>{links[links.length - 1].title}</span>
      </p>
    </Wrapper>
  );
};

export default BreadCrumbs;
