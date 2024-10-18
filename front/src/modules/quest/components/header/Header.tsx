import { Box } from "@mui/material";

import { ShowMore } from "@components/UI/showMore";
import { ProjectInfo } from "@components/projectInfo";
import { BreadCrumbs } from "@components/breadCrumbs";
import { CountDown } from "@components/countDown";
import {
  ILoyaltyProject,
  LoyaltyProjectStatuses,
  PartnerProject,
} from "@modules/quest/models";
import { HeaderStyled, HeaderWrapper } from "./header.styles";
import { Trans } from "@lingui/macro";
import { useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";
import { DateTime } from "luxon";
import { MarkdownAndHTML } from "@components/MarkdownAndHTML/MarkdownAndHTML";

type Props = {
  projectData: ILoyaltyProject | null;
  isPreview?: boolean;
  fullPreview?: boolean;
};

const Header = ({ projectData, isPreview, fullPreview }: Props) => {
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const claimStart = useMemo(() => {
    if (projectData?.claimingStartAt || projectData.startAt) {
      return DateTime.fromISO(`${projectData.claimingStartAt}`)
        .toUTC()
        .toFormat("dd MMM");
    }

    return null;
  }, []);

  const claimEnd = useMemo(() => {
    if (projectData?.claimingEndAt || projectData.claimingEndAt) {
      return DateTime.fromISO(`${projectData.claimingEndAt}`)
        .toUTC()
        .toFormat("dd MMM");
    }

    return null;
  }, []);

  const links = useMemo(() => {
    return [
      {
        id: 1,
        title: "AlphaQuest",
        link: "/",
      },
      {
        id: 2,
        title: projectData?.title,
        link: "/",
      },
    ];
  }, [projectData]);

  const timeStatus = useMemo(() => {
    const now = DateTime.now().toMillis();

    const start = projectData?.startAt
      ? DateTime.fromISO(`${projectData.startAt}`).toUTC().toMillis()
      : null;

    const end = projectData?.endAt
      ? DateTime.fromISO(`${projectData.endAt}`).toUTC().toMillis()
      : null;

    if (start && start > now) {
      return LoyaltyProjectStatuses.Soon;
    }
    if (start && end && start <= now && now < end) {
      return LoyaltyProjectStatuses.Active;
    }

    if (end && end < now) {
      return LoyaltyProjectStatuses.Expired;
    }
  }, [projectData]);

  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      descriptionRef.current &&
      descriptionRef.current.innerText.length > 150
    ) {
      // console.log(
      //   "descriptionRef.current.innerText",
      //   descriptionRef.current.innerText,
      // );
      // descriptionRef.current.innerText =
      //   descriptionRef.current.innerText.slice(0, 150) + "...";
    }
  }, [descriptionRef.current, isPreview]);

  const showShowMoreButton: boolean = useMemo(() => {
    return descriptionRef.current
      ? descriptionRef.current.innerText.length > 150
      : projectData.description.length > 150;
  }, [descriptionRef.current]);

  return (
    <>
      {projectData && (
        <HeaderWrapper className="c-font-color">
          {links && !isPreview && (
            <Box mb={2}>
              <BreadCrumbs links={links} />
            </Box>
          )}

          <HeaderStyled preview={isPreview} fullPreview={fullPreview}>
            <div className="partners">
              {projectData.partnerProjects.map(
                (partnerProject: PartnerProject) => (
                  <ProjectInfo
                    linkTitle={partnerProject.linkTitle}
                    key={partnerProject.name}
                    title={partnerProject.name}
                    image={partnerProject.logo}
                    approved={partnerProject.verificationIcon}
                  />
                ),
              )}
            </div>

            <Box
              className="time"
              pl={isPreview && !fullPreview ? "0 !important" : "auto"}
              sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
            >
              <p
                className={classnames(
                  "time-text",
                  "c-font-14-16 c-font-color-3",
                )}
              >
                {projectData.status || LoyaltyProjectStatuses.Soon}
              </p>

              {projectData.status &&
                (!isPreview || fullPreview) &&
                (timeStatus === LoyaltyProjectStatuses.Soon ||
                  timeStatus === LoyaltyProjectStatuses.Active ||
                  timeStatus === LoyaltyProjectStatuses.Expired) && (
                  <Box
                    component="p"
                    mx={1}
                    className="c-font-10-16 c-font-color-3"
                  >
                    |
                  </Box>
                )}

              {timeStatus === LoyaltyProjectStatuses.Soon && (
                <p className="c-font-14-16 c-font-color-3">
                  {DateTime.fromISO(`${projectData.startAt}`)
                    .toUTC()
                    .toFormat("dd MMM yyyy HH:mm:ss")}{" "}
                  UTC
                </p>
              )}

              {timeStatus === LoyaltyProjectStatuses.Expired && (
                <p className="c-font-14-16 c-font-color-3">
                  {DateTime.fromISO(`${projectData.endAt}`)
                    .toUTC()
                    .toFormat("dd MMM yyyy")}
                </p>
              )}

              {timeStatus === LoyaltyProjectStatuses.Active &&
                projectData.endAt && (
                  <CountDown
                    className="c-font-14-16"
                    date={projectData.endAt}
                    color="var(--color-gr2)"
                  />
                )}
            </Box>
          </HeaderStyled>

          {projectData.title && (
            <Box
              component="h1"
              mt={{ sm: 0.75 }}
              className="c-font-32-38 c-sm-font-48-56"
              style={{
                whiteSpace: isPreview ? "break-spaces" : "normal",
                wordWrap: isPreview ? "break-word" : "normal",
              }}
            >
              {projectData.title}
            </Box>
          )}
          {claimStart && claimEnd && (
            <Box
              component="p"
              mt={{ sm: 0.75 }}
              className="c-font-16-22 c-font-color-3"
            >
              <Trans id="kbrxjgxXWpDFfonDERUfau-quest">Claimable period:</Trans>{" "}
              {claimStart} - {claimEnd}
            </Box>
          )}
          {projectData.description && (
            <Box
              className={"short-description"}
              display={isShowMore ? "none" : "-webkit-box"}
              ref={descriptionRef}
              style={
                isPreview && !fullPreview
                  ? {
                      wordBreak: "break-all",
                      whiteSpace: "break-spaces",
                    }
                  : {}
              }
            >
              <Box mt={2}>
                <MarkdownAndHTML description={projectData.description} />
              </Box>
            </Box>
          )}
          {showShowMoreButton && (
            <ShowMore
              isOpened={isShowMore}
              setIsOpened={setIsShowMore}
              headerClassName={classnames("show-more-btn", {
                opened: isShowMore,
              })}
            >
              <MarkdownAndHTML description={projectData.description} />
            </ShowMore>
          )}

          {projectData.socialDescription && (
            <MarkdownAndHTML
              description={projectData.socialDescription}
              typeForce={"md"}
            />
          )}
        </HeaderWrapper>
      )}
    </>
  );
};

export default Header;
