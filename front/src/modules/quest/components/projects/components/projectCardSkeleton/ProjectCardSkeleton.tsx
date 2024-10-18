import { FC } from "react";
import { Box } from "@mui/material";

import { SkeletonLoader } from "@components/UI/skeletonLoader";
import { Wrapper } from "./projectCardSkeleton.styles";

interface ProjectCardSkeletonProps {
  className?: string;
}

const ProjectCardSkeleton: FC<ProjectCardSkeletonProps> = ({ className }) => {
  return (
    <Wrapper className={className}>
      <div className="content">
        <Box mb={2}>
          <Box className="head" mb={1.5}>
            <SkeletonLoader width="30%" height="15px" />

            <SkeletonLoader width="45%" height="15px" />
          </Box>

          <Box className="profile">
            <SkeletonLoader height="44px" width="44px" borderRadius={44} />

            <Box className="profile-texts">
              <Box mb={0.5}>
                <SkeletonLoader height="18px" width="100%" />
              </Box>

              <SkeletonLoader height="20px" width="100%" />
            </Box>
          </Box>
        </Box>

        <Box mt="auto">
          <Box mb={1}>
            <SkeletonLoader width="100%" height="20px" />
          </Box>

          <Box className="items">
            <SkeletonLoader height="68px" borderRadius={4} />
            <SkeletonLoader height="68px" borderRadius={4} />
            <SkeletonLoader height="68px" borderRadius={4} />
          </Box>
        </Box>
      </div>
    </Wrapper>
  );
};

export default ProjectCardSkeleton;
