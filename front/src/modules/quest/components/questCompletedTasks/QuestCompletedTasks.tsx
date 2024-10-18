import { QuestCompletedTasksStyles } from "@modules/quest/components/questCompletedTasks/QuestCompletedTasks.styles";
import { Trans } from "@lingui/macro";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import { Input } from "@components/UI/input";
import classNames from "classnames";
import { DateTime } from "luxon";
import { ChangeEvent, useState } from "react";
import Button from "@components/UI/button/Button";
import Tooltip from "@components/UI/tooltip/Tooltip";
import { useGetQuestAnalyticsTasksQuery } from "@modules/quest/hooks/quest.api";
import { IQuestTasksCompletionByDate } from "@models";
import csvDownload from "json-to-csv-export";
import { CBreakpoints } from "../../../../styles/variables";

interface IProps {
  questLinkTitle: string;
}

export const QuestCompletedTasks = ({ questLinkTitle }: IProps) => {
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState(getEndDate().toISOString());
  const { data: rawData, isLoading } = useGetQuestAnalyticsTasksQuery(
    {
      questLinkTitle,
      startDate,
      endDate,
    },
    {},
  );
  const data = rawData as IQuestTasksCompletionByDate[];

  const handleClickCSV = () => {
    const csv = data.map(item => [
      item.title,
      item.completionCount,
      item.total,
    ]);

    return csvDownload({
      data: csv,
      filename: questLinkTitle,
      delimiter: ",",
      headers: ["Task", "Users Completed", "Total"],
    });
  };

  const renderDates = () =>
    `${DateTime.fromISO(startDate).toFormat("dd.MM")} - ${DateTime.fromISO(
      endDate,
    ).toFormat("dd.MM")}`;

  const isMd = useMediaQuery(`(max-width: ${CBreakpoints.md}px)`);

  const tableColumnClass = classNames("c-font-color c-fw-500", {
    "c-font-12-12": isMd,
    "c-font-16-18": !isMd,
  });

  return (
    <QuestCompletedTasksStyles>
      <p className={"c-font-color c-fw-500 c-font-20-22"}>
        <Trans id={"sddfnbhu-4659845dfbjkd-dfbjkdfb"}>
          Number of completed tasks
        </Trans>
      </p>
      <div className={"filter"}>
        <Box className="inputWrapper date" mr={3}>
          <Box display={"flex"}>
            <Box
              className="c-font-16-22 c-fw-500 c-font-color"
              component="p"
              mb={0.75}
            >
              <Trans id="brdfs-123CbKrhZTGq9G9KNpvadeD-quest">From</Trans>
            </Box>
            <Tooltip value={"To date must be greater than from date"}>
              <Box>
                <Box
                  className={classNames(
                    "tooltip",
                    "c-font-10-10 c-font-color-2",
                  )}
                  component="span"
                  ml={1}
                >
                  ?
                </Box>
              </Box>
            </Tooltip>
          </Box>
          <Input
            className={classNames("c-full-width", "input")}
            name="startAt"
            value={DateTime.fromISO(startDate).toFormat("yyyy-LL-dd'T'T")}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setStartDate(new Date(e.target.value).toISOString())
            }
            classnames={{ error: "error" }}
            type="datetime-local"
            clearbtn={false}
            placeholder={""}
          />
        </Box>

        <Box className="inputWrapper date" mr={3}>
          <Box display={"flex"}>
            <Box
              className="c-font-16-22 c-fw-500 c-font-color"
              component="p"
              mb={0.75}
            >
              <Trans id="crt3-brCbKrhZTGq9G9KNpvadeD-quest">To</Trans>
            </Box>
            <Tooltip value={"To date must be greater than from date"}>
              <Box>
                <Box
                  className={classNames(
                    "tooltip",
                    "c-font-10-10 c-font-color-2",
                  )}
                  component="span"
                  ml={1}
                >
                  ?
                </Box>
              </Box>
            </Tooltip>
          </Box>
          <Input
            className={classNames("c-full-width", "input")}
            name="startAt"
            value={DateTime.fromISO(endDate).toFormat("yyyy-LL-dd'T'T")}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEndDate(new Date(e.target.value).toISOString())
            }
            classnames={{ error: "error" }}
            type="datetime-local"
            clearbtn={false}
            placeholder={""}
          />
        </Box>

        {!isMd && (
          <Button
            style={"colorfull"}
            onClick={handleClickCSV}
            disabled={isLoading}
          >
            <Trans id={"fd-bjn32-vdbn-23vnjfkdb"}>
              Export all data in .csv
            </Trans>
          </Button>
        )}
      </div>

      <Box mt={4}>
        <TableContainer className={"table"}>
          <Table width={"100%"} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={"tasks-column"}>
                  <p className={tableColumnClass}>
                    <Trans id={"jdskvb2023kjvb-wskjvb-32ewsvkj"}>Tasks</Trans>
                  </p>
                </TableCell>
                <TableCell className={"users-column"}>
                  <Box>
                    <p className={tableColumnClass}>
                      <Trans id={"j2dskvb2023kjvb-wskjvb-32ewsvkj"}>
                        Users Completed
                      </Trans>
                    </p>
                    <Box component={"p"} mt={0.5} className={tableColumnClass}>
                      {renderDates()}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className={"total-column"}>
                  <p className={tableColumnClass}>
                    <Trans id={"jde-6skvb2023kjvb-wskjvb-32ewsvkj"}>
                      Total
                    </Trans>
                  </p>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <p className={tableColumnClass}>{item.title}</p>
                    </TableCell>
                    <TableCell className={"users-column"}>
                      <p className={tableColumnClass}>{item.completionCount}</p>
                    </TableCell>
                    <TableCell>
                      <p className={tableColumnClass}>{item.total}</p>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isMd && (
          <Box mt={4}>
            <Button
              style={"colorfull"}
              onClick={handleClickCSV}
              disabled={isLoading}
            >
              <Trans id={"fd-bjn32-vdbn-23vnjfkdb"}>
                Export all data in .csv
              </Trans>
            </Button>
          </Box>
        )}
      </Box>
    </QuestCompletedTasksStyles>
  );
};

const getEndDate = () => {
  const today = new Date();
  const nextDate = new Date(today);
  nextDate.setDate(nextDate.getDate() + 3);
  return nextDate;
};
