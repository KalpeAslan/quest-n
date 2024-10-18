import { Box } from "@mui/material";
import { IQuestAnalytics } from "@models";
import countries from "@modules/quest/components/questAnalyticsGeography/country-by-abbrevation.json";
import { useEffect, useMemo, useState } from "react";

interface IProps {
  data: IQuestAnalytics["geography"];
}

const countryNameMultiplierInPx = 9;
const threshold = 2; // 2%

export const QuestAnalyticsGeographyBarChart = ({ data }: IProps) => {
  const [geoData, setGeoData] = useState<{ country: string; visits: number }[]>(
    [],
  );

  const totalVisits = useMemo(
    () => data.reduce((sum, item) => sum + +item.visits, 0),
    [data],
  );

  const maxValue = useMemo(
    () => Math.max(...data.map(item => +item.visits)),
    [data],
  );

  useEffect(() => {
    const result: { country: string; visits: number }[] = [];
    let otherVisits = 0;

    for (const item of data) {
      const percentage = (+item.visits / totalVisits) * 100;
      if (percentage < threshold) {
        otherVisits += +item.visits;
        continue;
      }
      result.push({
        country: getCountryNameByCode(item.countrycode),
        visits: +item.visits,
      });
    }

    const sortedResult = [...result].sort((a, b) => b.visits - a.visits);

    if (otherVisits) {
      sortedResult.push({ country: "Other", visits: +otherVisits });
    }

    setGeoData([...sortedResult]);
  }, [data, totalVisits]);

  const longestCountryName = useMemo(
    () => Math.max(...geoData.map(item => item.country.length)),
    [geoData],
  );

  return (
    <Box className={"quest-analytics__geo-bar-chart"}>
      {geoData.length ? (
        geoData.map((item, index) => (
          <Box
            className={"quest-analytics__geo-bar-chart__item"}
            key={index}
            display={"flex"}
            alignItems={"center"}
            py={3}
          >
            <Box
              minWidth={longestCountryName * countryNameMultiplierInPx}
              mr={1}
              className={"c-font-color c-fw-400 c-font-16-18"}
            >
              {item.country}
            </Box>
            <Box height={10} width={"100%"}>
              <div
                className={"quest-analytics__geo-bar-chart__line"}
                style={{
                  width: `${(+item.visits / maxValue) * 100}%`,
                }}
              />
            </Box>
            <Box
              display={"inline-block"}
              ml={3}
              component={"span"}
              className={"c-font-color-3 c-font-16-18 c-fw-500"}
            >
              {`${((+item.visits / totalVisits) * 100).toFixed(2)}%`}
            </Box>
          </Box>
        ))
      ) : (
        <Box
          style={{ opacity: 0.5 }}
          textAlign={"center"}
          className={"c-font-color c-font-20-22 c-fw-500"}
        >
          No visits yet for this quest...
        </Box>
      )}
    </Box>
  );
};

function getCountryNameByCode(code: string) {
  const value = countries.find(
    item => item.abbreviation.toLowerCase() === code.toLowerCase(),
  );
  return value ? value.country : code;
}
