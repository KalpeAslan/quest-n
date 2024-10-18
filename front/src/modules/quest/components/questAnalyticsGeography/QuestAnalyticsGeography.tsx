import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import worldMap from "./topoJson.json";
import countriesRaw from "./country-by-abbrevation.json";
import { QuestAnalyticsGeographyStyles } from "@modules/quest/components/questAnalyticsGeography/QuestAnalyticsGeography.styles";
import { useMemo, useState } from "react";
import { QuestAnalyticsGeographyBarChart } from "@modules/quest/components/questAnalyticsGeography/QuestAnalyticsGeographyBarChart";
import { Box } from "@mui/material";
import { IQuestAnalytics } from "@models";

interface IProps {
  data: IQuestAnalytics["geography"];
}

export const QuestAnalyticsGeography = ({ data }: IProps) => {
  const [tooltipContent, setTooltipContent] = useState("");

  const totalVisits = useMemo(
    () => data.reduce((sum, item) => sum + +item.visits, 0),
    [data],
  );

  const findCountryWithVisits = (countryName: string) => {
    const country = getCountryCodeByName(countryName);
    if (country) {
      const countryWithVisits = data.find(
        item =>
          item.countrycode.toLowerCase() === country.abbreviation.toLowerCase(),
      );
      return {
        ...country,
        visits: countryWithVisits
          ? (+countryWithVisits.visits / totalVisits) * 100
          : 0,
      };
    }
  };

  const selectedCountry = useMemo(() => {
    if (tooltipContent) {
      return findCountryWithVisits(tooltipContent);
    }
    return null;
  }, [tooltipContent, data]);

  return (
    <QuestAnalyticsGeographyStyles>
      <p
        style={{ marginBottom: 26 }}
        className={"c-font-color c-fw-500 c-font-20-22"}
      >
        Geography
      </p>
      <div className={"quest-analytics__geo-wrapper"}>
        <QuestAnalyticsGeographyBarChart data={data} />
        <div className={"quest-analytics__geo-map"}>
          <ComposableMap
            projectionConfig={{
              scale: 205,
            }}
            style={{
              width: "100%",
              height: "auto",
            }}
          >
            <Geographies geography={worldMap}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const country = findCountryWithVisits(geo.properties.name);
                  return (
                    <Geography
                      geography={geo}
                      key={geo.rsmKey}
                      data-tooltip-id={geo.properties.name}
                      onMouseEnter={() => {
                        setTooltipContent(`${geo.properties.name}`);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                      }}
                      style={{
                        default: {
                          fill:
                            country && country.visits > 0
                              ? country.visits > 50
                                ? "var(--color-gr2)"
                                : "#5E805D"
                              : "rgba(255, 255, 255, 0.20)",
                          outline: "none",
                        },
                        hover: {
                          fill: "var(--color-gr2)",
                          outline: "none",
                        },
                        pressed: {
                          fill: "var(--color-gr2)",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
          <Tooltip
            isOpen={!!tooltipContent}
            id={tooltipContent}
            className={"quest-analytics__geo-tooltip"}
            noArrow
          >
            {selectedCountry ? (
              <Box py={0.7} px={1}>
                <Box display={"flex"} alignItems={"center"} gap={1}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    loading={"lazy"}
                    src={`https://flagsapi.com/${selectedCountry.abbreviation}/flat/64.png`}
                    alt={selectedCountry.abbreviation}
                    width={25}
                    height={25}
                    style={{ borderRadius: 10 }}
                  />
                  <Box
                    component={"p"}
                    className={"c-font-color c-font-14-16 c-fw-500"}
                  >
                    {selectedCountry.country}
                  </Box>
                </Box>
                <Box
                  className={"c-font-color-3 c-font-14-16 c-fw-500"}
                  component={"p"}
                >
                  {selectedCountry
                    ? `${selectedCountry.visits.toFixed(2)} %`
                    : "0%"}
                </Box>
              </Box>
            ) : (
              <></>
            )}
          </Tooltip>
        </div>
      </div>
    </QuestAnalyticsGeographyStyles>
  );
};

interface ICountry {
  country: string;
  abbreviation: string;
  visits?: number;
}

function getCountryCodeByName(name: string): ICountry | null {
  const countries = countriesRaw as ICountry[];
  return (
    countries.find(item => item.country.toLowerCase() === name.toLowerCase()) ||
    null
  );
}
