import { Box } from "@mui/material";
import { DescriptionWrapper, Wrapper } from "./partnerProjectHeader.styled";
import { Image } from "@/components/UI/image";
import { ShowMore } from "@/components/UI/showMore";
import { FC, useState } from "react";
import classNames from "classnames";
import { IPartnerProject } from "../../../quest/models";
import { appConfig } from "@/app.config";
import { Icon } from "@/components/UI/icon";
import { HelperService } from "@/services";
import { Trans } from "@lingui/macro";
import { DateTime } from "luxon";
import { MarkdownAndHTML } from "@components/MarkdownAndHTML/MarkdownAndHTML";
import Button from "@components/UI/button/Button";
import { useRouter } from "next/router";
import { LeaveFromPartnerProjectPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/LeaveFromPartnerProjectPopup";

interface Props {
  project: IPartnerProject;
  showAdminPanel?: boolean;
}

const PartnerProjectHeader: FC<Props> = ({ project, showAdminPanel }) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const { push } = useRouter();

  const [showLeavePopup, setShowPopup] = useState<boolean>(false);

  return (
    <Wrapper component="header" className="c-font-color c-font-14-20 c-wrap">
      <Box className="leftWrapper">
        <Box className="topWrapper">
          <div className="imageWrapper">
            <div className="image">
              <Image
                lazyLoading
                src={
                  project.logo
                    ? `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${project.logo}`
                    : null
                }
                alt="test"
                size="48"
              />
            </div>

            {project.verificationIcon && (
              <Icon
                className="icon"
                name={"quest-check-mark"}
                size="20"
                style={{ position: "absolute", bottom: 0, right: 0 }}
              />
            )}
          </div>

          <Box component="p" className="c-font-16-22 c-font-color mr-24 tablet">
            <Trans id="5kYhGEQGp7Eziq4rK3cF5U-quest">Participants</Trans>{" "}
            <span className="green">
              {HelperService.addNumberSeparator(project.participants || 0)}
            </span>
          </Box>

          {project.createdAt && (
            <Box component="p" className="c-font-16-22 c-font-color tablet">
              <Trans id="8seuktjCn6eos439SKYjW5-quest">Created</Trans>{" "}
              <span className="green">
                {DateTime.fromISO(new Date(project.createdAt).toISOString())
                  .toUTC()
                  .toFormat("dd.LL.yyyy")}
              </span>
            </Box>
          )}
        </Box>

        <Box className="divider tablet" />

        <Box>
          <Box
            component="h1"
            className="c-font-20-24 c-sm-font-32-38 c-font-color"
          >
            {project.name}
          </Box>
          {project.shortDescription && (
            <DescriptionWrapper
              className={classNames({ desc: !showMore }, "c-font-14-20")}
              mt={{ xs: 1, sm: 0.5 }}
            >
              <MarkdownAndHTML description={project.shortDescription} />
            </DescriptionWrapper>
          )}
          {project.projectDescription && (
            <ShowMore
              isOpened={showMore}
              setIsOpened={setShowMore}
              headerClassName={classNames("show-more-btn", {
                opened: showMore,
              })}
            >
              <MarkdownAndHTML description={project.projectDescription} />
            </ShowMore>
          )}
          {project.socialDescription && (
            <MarkdownAndHTML description={project.socialDescription} />
          )}
        </Box>
      </Box>

      <Box className="divider mobile desktop" />

      <Box>
        <Box
          className={classNames(
            "paramsContainer c-font-14-20 c-font-color mobile desktop",
            {
              "desktop-admin": showAdminPanel,
            },
          )}
        >
          <Box
            component="p"
            className={classNames("param", {
              mb: !showAdminPanel,
              mr: showAdminPanel,
            })}
          >
            <Trans id="5kYhGEQGp7Eziq4rK3cF5U-quest">Participants</Trans>{" "}
            <span className="green">
              {HelperService.addNumberSeparator(project.participants || 0)}
            </span>
          </Box>

          {project.createdAt && (
            <Box component="p" className="param">
              <Trans id="8seuktjCn6eos439SKYjW5-quest">Created</Trans>{" "}
              <span className="green">
                {DateTime.fromISO(new Date(project.createdAt).toISOString())
                  .toUTC()
                  .toFormat("dd.LL.yyyy")}
              </span>
            </Box>
          )}
        </Box>
        {showAdminPanel && (
          <Box mt={3} display={"flex"} alignItems={"center"} gap={2}>
            <Button
              href={`/admin/project/${project.linkTitle}/edit`}
              target={"_self"}
              style={"secondary"}
              size={"task"}
              onClick={() => push}
            >
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={"10px"}
              >
                <Icon name={"menu-settings"} size={"24"} />
                <Trans id={"poiuytf-vbnkadwr"}>Settings</Trans>
              </Box>
            </Button>
            {project.isDelegated && (
              <Button
                style={"secondary"}
                size={"task"}
                onClick={() => setShowPopup(true)}
              >
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  gap={"10px"}
                >
                  <Icon
                    className={"c-font-color-4"}
                    name={"leave"}
                    size={"24"}
                  />
                  <Trans id={"1poiuytf-vbnkadwr"}>Leave</Trans>
                </Box>
              </Button>
            )}
          </Box>
        )}
      </Box>
      {project && (
        <LeaveFromPartnerProjectPopup
          projectLinkTitle={project.linkTitle}
          isOpen={showLeavePopup}
          onClose={() => setShowPopup(false)}
        />
      )}
    </Wrapper>
  );
};

export default PartnerProjectHeader;
