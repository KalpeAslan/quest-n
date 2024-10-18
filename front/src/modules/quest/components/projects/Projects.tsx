import { FC, useEffect, useMemo, useRef } from "react";
import { Trans } from "@lingui/macro";
import { ProjectCard } from "./components/projectCard";
import { IQuestShort } from "../../models";
import { Items, Message } from "./projects.styles";
import { ProjectCardSkeleton } from "./components/projectCardSkeleton";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { useRouter } from "next/router";
import { sendAnalyticsDataThunk } from "@store/slices/analytics/analytics.thunks";
import { useObserver } from "@/hooks/useObserver";
import { Loader } from "@/components/UI/loader";
import { Box } from "@mui/material";

type ProjectsProps = {
  projects: IQuestShort[];
  isLoaded: boolean;
  handleNext: () => void;
  loadMore: boolean;
  shouldResetObserver: boolean;
  isMoreLoaded: boolean;
};

const Projects: FC<ProjectsProps> = ({
  projects,
  isLoaded,
  handleNext,
  loadMore,
  shouldResetObserver,
  isMoreLoaded,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const { push } = useRouter();

  const [isViewed, setIsViewed] = useObserver(lastItemRef);

  useEffect(() => {
    if (isViewed && typeof handleNext === "function" && loadMore) {
      handleNext();
    }
  }, [isViewed, loadMore]);

  useEffect(() => {
    if (shouldResetObserver) {
      setIsViewed(false);
    }
  }, [shouldResetObserver, setIsViewed]);

  const handleClickProjectCard = (data: IQuestShort, index: number) => {
    return () => {
      dispatch(
        sendAnalyticsDataThunk({
          type: "quest_tap",
          options: {
            event_property_quest_name: data.title,
            event_property_quest_position: index,
          },
        }),
      );

      push(`/quest/${data.linkTitle}`);
    };
  };

  const items = useMemo(() => {
    return projects && projects.length > 0 ? (
      <Items>
        {projects.map((item: IQuestShort, index) => (
          <ProjectCard
            onClick={handleClickProjectCard(item, index)}
            key={item.id}
            index={index}
            data={item}
            ref={index + 1 === projects.length ? lastItemRef : itemRef}
          />
        ))}
        {!isMoreLoaded && (
          <Box width="100%" position="relative" height="40px">
            <Loader />
          </Box>
        )}
      </Items>
    ) : (
      <Message className="c-font-16-20 c-font-color-9">
        <Trans id="hEZvvvKCWZKpmwA2RUvht6-quest">No projects found.</Trans>
      </Message>
    );
  }, [projects, isMoreLoaded]);

  return (
    <>
      {isLoaded ? (
        <>{items}</>
      ) : (
        <Items>
          <ProjectCardSkeleton className="mobile" />

          <ProjectCardSkeleton className="medium" />

          <ProjectCardSkeleton />
        </Items>
      )}
    </>
  );
};

export default Projects;
