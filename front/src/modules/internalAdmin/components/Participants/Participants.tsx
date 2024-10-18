import { IParticipant } from "@models/InternalAdmin";
import { Box, CircularProgress, Divider } from "@mui/material";
import Table from "@components/UI/table/Table";
import { ELoyaltyTasks } from "@models";
import Image from "next/image";
import { appConfig } from "@/app.config";
import Button from "@components/UI/button/Button";
import csvDownload from "json-to-csv-export";
import { EProjectType } from "../../../quest/models";

interface IProps {
  questLinkTitle: string;
  projectType: EProjectType;
  data: IParticipant[];
  isLoading: boolean;
}

const excludedFields = ["loyaltyProjectId", "investorId"] as string[];

const columnWidth = 150;

export const Participants = ({
  questLinkTitle,
  projectType,
  data: participants,
  isLoading
}: IProps) => {

  const { table, csv, headers, filteredHeaders } = (() => {
    const headers = participants.reduce((acc, currentValue) => {
      Object.keys(currentValue).forEach(key => {
        if (!excludedFields.includes(key)) {
          acc[key] = key;
        }
      });
      return acc;
    }, {} as Record<string, any>);

    const filteredHeaders = Object.keys(headers).filter(item => {
      if (
        projectType !== EProjectType.Scoreboard &&
        (item === "scoreboardPlace" || item === "earnedPoints")
      )
        return false;

      if (
        projectType === EProjectType.Scoreboard &&
        item.toLowerCase() === "status"
      )
        return false;
      return true;
    });

    const table = filteredHeaders.map(item => ({
      render: (data: IParticipant) => {
        const value = data[item];
        if (typeof value === "object" && value) {
          switch (value.type) {
            case ELoyaltyTasks.SUGGESTION:
              return (
                <Box
                  whiteSpace={"break-spaces"}
                  sx={{ wordBreak: "break-all" }}
                  maxWidth={columnWidth}
                >
                  {value.description || "-"}
                </Box>
              );
            case ELoyaltyTasks.EMAIL:
              return (
                <Box
                  whiteSpace={"break-spaces"}
                  sx={{ wordBreak: "break-all" }}
                  maxWidth={columnWidth}
                >
                  {value.email || "-"}
                </Box>
              );
            case ELoyaltyTasks.IMAGE_UPLOAD:
              return (
                <Box>
                  {value.imgSrc ? (
                    <Image
                      objectFit={"cover"}
                      sizes={"100%"}
                      width={150}
                      height={150}
                      src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${value.imgSrc}`}
                      alt={item}
                    />
                  ) : (
                    "-"
                  )}
                </Box>
              );
          }
        }
        return  <Box
          whiteSpace={"break-spaces"}
          sx={{ wordBreak: "break-all" }}
        >
          {data[item] || "-"}
        </Box>
      },
      align: "center",
      width: columnWidth,
      header: item,
    }));

    const csv = participants.map(item => {
      return filteredHeaders.map(key => {
        const value = item[key];

        if (typeof value === "object" && value) {
          switch (value.type) {
            case ELoyaltyTasks.SUGGESTION:
              return value.description || "-";
            case ELoyaltyTasks.EMAIL:
              return value.email || "-";
            case ELoyaltyTasks.IMAGE_UPLOAD:
              return (
                `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${value.imgSrc}` || "-"
              );
          }
        }
        return value || "-";
      });
    });

    return {
      table,
      csv,
      headers,
      filteredHeaders,
    };
  })();

  const handleClickCSV = () => {
    return csvDownload({
      data: csv,
      filename: questLinkTitle,
      delimiter: ",",
      headers: filteredHeaders,
    });
  };

  return (
    <Box overflow={"auto"} maxWidth={"90vw"} width={"100%"} pt={4}>
      {isLoading ? (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          minWidth={500}
          width={"100%"}
          color={"var(--color-gr2)"}
        >
          <CircularProgress color={"inherit"} />
        </Box>
      ) : (
        <Box>
          <Button onClick={handleClickCSV} style={"primary"}>
            Download As CSV
          </Button>

          <Divider sx={{ mt: 4 }} />
          <Box width={columnWidth * Object.keys(headers).length}>
            <Table
              columns={table as any}
              items={participants}
              mobile={1}
              type={"primary"}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
