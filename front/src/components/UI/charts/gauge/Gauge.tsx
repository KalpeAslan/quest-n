// import { useMemo } from "react";
// import { scaleLinear } from "d3-scale";
import { ExperienceLevel } from "@models";
//
// import {
//   GaugeStylesItem,
//   GaugeStylesCont,
//   GaugeStylesFooter,
//   GaugeStylesWrapper,
//   GaugeStylesSlider,
// } from "./gauge.styles";
// import { Trans } from "@lingui/macro";

type Props = {
  totalTokens: number;
  currentLevel: ExperienceLevel | null;
  levels: ExperienceLevel[];
  nextLevel: ExperienceLevel | null;
};

export const Gauge = ({
  totalTokens,
  currentLevel,
  levels,
  nextLevel,
}: Props) => {
  return <></>;
  // const currentLevelParts = useMemo(() => {
  //   return levels.filter((level: ILevel) => level.name === currentLevel?.name);
  // }, [levels, currentLevel]);
  //
  // const min = useMemo(() => {
  //   return currentLevelParts[0] && currentLevelParts[0].tokensFrom;
  // }, [currentLevelParts]);
  //
  // const max = useMemo(() => {
  //   if (!nextLevel && currentLevelParts[currentLevelParts.length - 1]) {
  //     return currentLevelParts[currentLevelParts.length - 1].tokensFrom;
  //   }
  //
  //   return nextLevel?.tokensFrom;
  // }, [nextLevel, currentLevelParts]);
  //
  // const percentScale = useMemo(() => {
  //   return scaleLinear().domain([min, max]).range([0, 1]);
  // }, [min, max]);
  //
  // const computePercentageToNextLevel = (value: number) => {
  //   return nextLevel.tokensFrom ? (100 / nextLevel.tokensFrom) * value : 0;
  // };
  //
  // const computedMarks = useMemo(() => {
  //   const currentLevelsToPercent = currentLevelParts.map((level: ILevel) => {
  //     return {
  //       label: level.number,
  //       value: computePercentageToNextLevel(level.tokensFrom),
  //     };
  //   });
  //   currentLevelsToPercent.shift();
  //   return currentLevelsToPercent;
  // }, [currentLevelParts, percentScale, nextLevel]);
  //
  // return (
  //   <GaugeStylesWrapper>
  //     <GaugeStylesCont>
  //       <p className="c-font-grad c-font-32-36 c-inline-block">
  //         {totalTokens} AQ
  //       </p>
  //
  //       <p className="c-font-16-22 c-fw-500 c-font-color">
  //         {currentLevel?.name}, {currentLevel?.number}{" "}
  //         <Trans id="czsxBcJVx8jqdrk6RZVUC2-UI">level</Trans>
  //       </p>
  //     </GaugeStylesCont>
  //
  //     <GaugeStylesSlider
  //       aria-label="Custom marks"
  //       defaultValue={0}
  //       step={1}
  //       disabled
  //       value={computePercentageToNextLevel(totalTokens)}
  //       valueLabelDisplay="auto"
  //       marks={computedMarks}
  //     />
  //     <GaugeStylesFooter mt={-1}>
  //       {currentLevel && (
  //         <GaugeStylesItem>
  //           <p className="c-font-12-16 c-font-color">
  //             {currentLevel.tokensFrom} AQ
  //           </p>
  //           <p className="c-font-12-16 c-font-color-2">{currentLevel.name}</p>
  //         </GaugeStylesItem>
  //       )}
  //
  //       {nextLevel && (
  //         <GaugeStylesItem>
  //           <p className="c-font-12-16 c-font-color">
  //             {nextLevel.tokensFrom} AQ
  //           </p>
  //           <p className="c-font-12-16 c-font-color-2">{nextLevel.name}</p>
  //         </GaugeStylesItem>
  //       )}
  //     </GaugeStylesFooter>
  //   </GaugeStylesWrapper>
  // );
};
