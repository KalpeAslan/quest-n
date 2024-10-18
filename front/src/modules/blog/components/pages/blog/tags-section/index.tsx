import { useState } from "react";
import classnames from "classnames";
import { Box } from "@mui/material";

import { Scroll } from "@components/UI/scroll";
import { ITagItem } from "@models";

// import st from "./tags.module.css";
import {
  TagStyles,
  ActiveSlideStyles,
  TagsSectionStylesWrapper,
} from "./tagsSection.styles";

type Props = {
  tags: ITagItem[];
  type: "show" | "active" | "active-slide" | "show-slide";
  title: string;
  setActiveTags?: (updatedTags: ITagItem[]) => Promise<void>;
};

export const TagsSection = ({ tags, type, title, setActiveTags }: Props) => {
  const [showAll, setShowAll] = useState<boolean>(
    !tags.find((tag: ITagItem) => tag.selectStatus),
  );

  const handleStatus = (item: ITagItem | null) => {
    if (item === null) {
      setShowAll(true);
      updateSelectStatus(null);

      return;
    }

    updateSelectStatus(item);
  };

  const updateSelectStatus = (item: ITagItem | null) => {
    if (item === null && setActiveTags) {
      const updatedStatus = tags.map((item: ITagItem) => ({
        ...item,
        selectStatus: false,
      }));

      setActiveTags(updatedStatus);

      return;
    }

    if (item && setActiveTags) {
      const tagsCopy = [...tags];
      const index = tagsCopy.findIndex((tag: ITagItem) => tag.id === item.id);

      if (index >= 0) {
        tagsCopy[index].selectStatus = !tags[index].selectStatus;

        setActiveTags(tagsCopy);

        const ifAnyActive = tagsCopy.find(
          (item: ITagItem) => item.selectStatus,
        );

        if (ifAnyActive) {
          setShowAll(false);
        } else {
          setShowAll(true);
        }
      }
    }
  };

  return (
    <section>
      <Box component="p" className="c-font-20-24 c-fw-500 c-font-color" mb={2}>
        {title}
      </Box>

      <TagsSectionStylesWrapper
        className={classnames({
          "active-slide": type === "active-slide",
          "show-slide": type === "show-slide",
        })}
      >
        {type === "active" && (
          <TagStyles
            className={classnames(
              { "tag-item-active-all": showAll },
              "c-font-14-20 c-font-color",
            )}
            onClick={() => handleStatus(null)}
          >
            All
          </TagStyles>
        )}

        {type === "active" &&
          tags.length > 0 &&
          tags.map((tag: ITagItem) => (
            <TagStyles
              className={classnames(
                { "tag-item-active": tag.selectStatus },
                "c-font-14-20 c-font-color",
              )}
              key={tag.id}
              onClick={() => handleStatus(tag)}
            >
              {tag.title}
            </TagStyles>
          ))}

        {type === "active-slide" && (
          <Scroll overflowBehavior={{ x: "scroll", y: "hidden" }} type="table">
            <ActiveSlideStyles>
              <TagStyles
                className={classnames(
                  { "tag-item-active-all": showAll },
                  "c-font-14-20 c-font-color",
                )}
                onClick={() => handleStatus(null)}
              >
                All
              </TagStyles>

              {tags.length > 0 &&
                tags.map((tag: ITagItem) => (
                  <TagStyles
                    className={classnames(
                      { "tag-item-active": tag.selectStatus },
                      "c-font-14-20 c-font-color",
                    )}
                    key={tag.id}
                    onClick={() => handleStatus(tag)}
                  >
                    {tag.title}
                  </TagStyles>
                ))}
            </ActiveSlideStyles>
          </Scroll>
        )}

        {type === "show-slide" && (
          <Scroll overflowBehavior={{ x: "scroll", y: "hidden" }} type="table">
            <div className={"show-slide"}>
              {tags.length > 0 &&
                tags.map((tag: ITagItem) => (
                  <TagStyles
                    as={"p"}
                    className={"c-font-14-20 c-font-color"}
                    key={tag.id}
                  >
                    {tag.title}
                  </TagStyles>
                ))}
            </div>
          </Scroll>
        )}

        {type === "show" &&
          tags.length > 0 &&
          tags.map((tag: ITagItem) => (
            <TagStyles
              as={"p"}
              className={"c-font-14-20 c-font-color"}
              key={tag.id}
            >
              {tag.title}
            </TagStyles>
          ))}
      </TagsSectionStylesWrapper>
    </section>
  );
};
