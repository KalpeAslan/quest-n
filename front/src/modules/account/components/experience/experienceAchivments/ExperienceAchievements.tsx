import { LevelExp } from "@modules/account/models";
import { Box, Theme, useMediaQuery } from "@mui/material";
import styled from "@emotion/styled";
import Image from "next/image";
import { CBreakpoints } from "@styles/variables";
import { appConfig } from "@/app.config";
import Button from "@components/UI/button/Button";
import { Trans } from "@lingui/macro";
import Link from "next/link";

interface IProps {
  currentLevel: LevelExp;
}
export const ExperienceAchievements = ({ currentLevel }: IProps) => {
  const isSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.sm),
  );

  const renderLevel = (level: LevelExp) => {
    return (
      <StyledAchievement
        bgImg={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${level.nftImage}`}
      >
        <Image
          src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${level.nftImage}`}
          alt={level.name}
          width={isSm ? 100 : 150}
          height={isSm ? 100 : 150}
        />
        <Box
          mt={2}
          component={"p"}
          mb={4}
          className={"achievement__name c-font-color c-fw-500 c-font-14-14"}
        >
          {level.name}
        </Box>
        {!level.isClaimed && (
          <Link
            className={"c-text-decoration-none"}
            href={`/quest/${level.linkTitle}`}
          >
            <Button className={"achievement__button"} style={"primary"}>
              <Trans id={"skjnb-2bjkfdb-3ewjkdvn"}>Mint NFT</Trans>
            </Button>
          </Link>
        )}
      </StyledAchievement>
    );
  };

  return (
    <div>
      <p className={"c-font-color c-font-20-20 c-fw-500"}>
        <Trans id={"kjbjkb-34bkjv-sdvjn"}>My achievements</Trans>
      </p>
      <Box
        mt={4}
        display={"grid"}
        gridTemplateColumns={"repeat(auto-fill, minmax(200px, 1fr))"}
        gap={"15px"}
        sx={theme => ({
          [theme.breakpoints.down(CBreakpoints.sm)]: {
            gridTemplateColumns: "1fr 1fr",
          },
        })}
      >
        {renderLevel(currentLevel)}
      </Box>
    </div>
  );
};

const StyledAchievement = styled(Box)<{ bgImg?: string }>`
  height: 300px;
  display: flex;
  padding: 9px 10px 20px 10px;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  max-width: 231px;
  justify-content: center;
  background-position: center;
  position: relative;
  overflow: hidden;

  ${props =>
    props.bgImg &&
    `
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url(${props.bgImg}),
        lightgray 0px -329.33px / 100% 321.553% no-repeat;
      background-position: center;
      background-size: cover;
      filter: blur(5px);
      z-index: -1;
      overflow: hidden;
    }
  `};

  @media (max-width: ${CBreakpoints.sm}px) {
    width: 165px;
  }

  &__name {
    margin-top: 15px;
    letter-spacing: 2.1px;
    text-transform: uppercase;
  }
`;
