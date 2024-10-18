import { detectContentType } from "@/utils/react.utils";
import { Markdown } from "@components/markdown";
import { HelperService } from "@services";
import styled from "@emotion/styled";
import { FC } from "react";

interface IProps {
  description: string;
  typeForce?: "md" | "html";
  className?: string;
}

export const MarkdownAndHTML: FC<IProps> = ({
  description,
  typeForce,
  className,
}) => {
  if (typeForce === "md")
    return <Markdown>{HelperService.parseMd(description)}</Markdown>;

  if (typeForce === "html")
    return (
      <StyledHTMLContainer
        className={className}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );

  if (!description) return null;
  const computedDescription = (() => {
    return description.replace(":abbr", "");
  })();
  const isHtml = detectContentType(computedDescription) === "html";

  return isHtml ? (
    <>
      <StyledHTMLContainer
        className={className}
        dangerouslySetInnerHTML={{ __html: computedDescription }}
      />
    </>
  ) : (
    <Markdown>{HelperService.parseMd(description)}</Markdown>
  );
};

const StyledHTMLContainer = styled.div`
  a {
    color: var(--color-gr2) !important;
  }
`;
