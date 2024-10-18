import { EProjectType } from "@/modules/quest/models";
import { Wrapper } from "./trop.styles";
import { FC } from "react";
import Image from "next/image";
import {
  guaranteedImg,
  luckyDrawImg,
  scoreboardImg,
} from "@/modules/quest/assets";
import { Box } from "@mui/material";
import { t } from "@lingui/macro";

interface Props {
  projectType: EProjectType;
  className?: string;
}

const Trop: FC<Props> = ({ projectType, className }) => {
  return (
    <Wrapper className={className}>
      <Box className="main">
        <Box mb="7px">
          {projectType === EProjectType.Scoreboard && (
            <Image
              src={scoreboardImg}
              width={53}
              height={46}
              alt={"scoreboard"}
            />
          )}
          {projectType === EProjectType.LuckyDraw && (
            <Image
              src={luckyDrawImg}
              width={49}
              height={57}
              alt={"luckyDraw"}
            />
          )}
          {projectType === EProjectType.Guaranteed && (
            <Image
              src={guaranteedImg}
              width={58}
              height={50}
              alt={"guaranteed"}
            />
          )}
        </Box>

        <Box className="c-font-color c-font-20-20 c-fw-500">
          {projectType === EProjectType.Scoreboard &&
            t({ id: "vSJFKS2BnVTkyDG92cEqQ3-quest", message: "Scoreboard" })}
          {projectType === EProjectType.LuckyDraw &&
            t({ id: "3cCssxr7fN6iaTcB5p5suf-quest", message: "Lucky Draw" })}
          {projectType === EProjectType.Guaranteed &&
            t({ id: "iEfEbjV4hYgnxkoEGCo1j3-quest", message: "Guaranteed" })}
        </Box>
      </Box>
    </Wrapper>
  );
};

export default Trop;
