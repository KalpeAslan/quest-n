import { Box, Theme, useMediaQuery } from "@mui/material";
import { Wrapper } from "./projectsPage.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getPartnerProjects } from "@/modules/account/store/account.selector";
import { PageLoader } from "@/components/pageLoader";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/UI/button";
import { setIsAdminPanelOpened } from "@/store/slices/system/system.slice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Trans, t } from "@lingui/macro";
import { CBreakpoints } from "@styles/variables";
import { PartnerProjectCard } from "@modules/quest/components/partnerProjects/PartnerProjectCard";
import { PartnerProjectsDropdown } from "@modules/quest/components/partnerProjectsDropdown/PartnerProjectsDropdown";
import Image from "next/image";
import { PartnerProjectAdmin } from "../../models";
import { getUserPartnerProjectsThunk } from "../../../account/store/account.thunks";

const ProjectsPage = () => {
  const data = useTypedSelector(getPartnerProjects) as PartnerProjectAdmin[] | null;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setIsAdminPanelOpened(true));
    dispatch(getUserPartnerProjectsThunk());

    return () => {
      dispatch(setIsAdminPanelOpened(false));
    };
  }, []);

  const isMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.md),
  );

  const isLg = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(CBreakpoints.lg),
  );

  const isHaveOwnProject = useMemo(() => {
    if (!data) {
      return false;
    }

    return data.some(project => !project.isDelegated);
  }, [data]);

  const renderCards = useMemo(() => {
    if (!data) return <></>;

    return data.map((item, index) => (
      <PartnerProjectCard key={index} data={item} />
    ));
  }, [data]);

  return (
    <div className="background-other">
      {data ? (
        <Wrapper>
          {isLg && (
            <div className={"projects-page__sidebar"}>
              <Box p={2}>
                <PartnerProjectsDropdown />
              </Box>
              <Image
                className={"projects-page__sidebar__image"}
                width={50}
                height={150}
                src={"/images/project/sidebar__gradient.png"}
                alt={"sidebar"}
              />
            </div>
          )}
          <div className={"projects-page__content c-wrap"}>
            <Box
              component="h2"
              className="title c-font-color c-font-23-38 c-sm-font-32-38 c-fw-500"
            >
              <Trans id="x46KxQui3uNzGqB4Lhgmt1-quest">Project profiles</Trans>
            </Box>

            <div className={"cardsWrapper"}>
              {!isHaveOwnProject && (
                <Box
                  className="card own"
                  sx={theme => ({
                    [theme.breakpoints.down(CBreakpoints.tablet)]: {
                      maxWidth: "100%",
                    },
                    maxWidth: 520,
                  })}
                >
                  <Box component="h3" className="cardTitle" textAlign="center">
                    {t({
                      id: "vasxeLsNbmDJUeLxyrqyMekoj-quest",
                      message: "create your Project profile",
                    })}
                  </Box>

                  <Box
                    component={"p"}
                    className={"c-fw-400 c-font-color c-font-16-22"}
                  >
                    <Trans id={"sdjvbi-24jbsd-dvdsvsds"}>
                      To Create Quest you need firstly create Project
                    </Trans>
                  </Box>

                  {isHaveOwnProject ? (
                    <Box
                      display={"flex"}
                      flexDirection={isMd ? "column" : "row"}
                      gap={"20px"}
                      flexWrap={"wrap"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Button style={"colorfull"}>
                        {t({
                          id: "k4eotAW9eX5WpEFPWvasdWTY6-quest",
                          message: "Create a new Quest",
                        })}
                      </Button>

                      <Button style={"secondary"}>
                        <Trans id={"2hire7fdvjknv-fj23ke7v"}>
                          Profile & Quests
                        </Trans>
                      </Button>
                    </Box>
                  ) : (
                    <Box mt={1}>
                      <Button
                        href={"/admin/project/create"}
                        target={"_self"}
                        style={"colorfull"}
                      >
                        <Trans id={"23-fbn7-439bkdvf-sdsd"}>
                          Create Project
                        </Trans>
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              {renderCards}
            </div>
          </div>
        </Wrapper>
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

export default ProjectsPage;
