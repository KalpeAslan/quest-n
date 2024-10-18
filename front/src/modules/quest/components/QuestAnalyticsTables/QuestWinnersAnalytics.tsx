import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { IQuestAnalyticsWinners } from "@models";
import { Trans } from "@lingui/macro";
import CopyToClipboard from "react-copy-to-clipboard";
import { Icon } from "../../../../components/UI/icon";
import React, { useEffect, useRef, useState } from "react";
import { EProjectType } from "@modules/quest/models";
import { getOrdinal } from "@/utils";
import Image from "next/image";
import { appConfig } from "@/app.config";
import { AccountDropdown } from "@components/account/account.styles";
import { Button } from "@components/UI/button";
import useClickOutside from "@hooks/useClickOutside";

interface IProps {
  data: IQuestAnalyticsWinners[];
  dataExist: boolean;
  questType: EProjectType | null;
}

export enum ESelectedField {
  email,
  twitter,
  telegram,
  discord,
}

export const QuestWinnersAnalytics = ({
  data,
  dataExist,
  questType,
}: IProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [seelctedField, setSelectedField] = useState<ESelectedField>(
    ESelectedField.email,
  );

  const ref = useRef(null);

  useClickOutside(ref, () => {
    setOpen(false);
  });

  useEffect(() => {
    if (copiedIndex !== null) {
      const timeout = setTimeout(() => {
        setCopiedIndex(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [copiedIndex]);

  const computeSelectedFieldTitle = () => {
    switch (seelctedField) {
      case ESelectedField.email:
        return "Email";
      case ESelectedField.twitter:
        return "Twitter";
      case ESelectedField.telegram:
        return "Telegram";
      case ESelectedField.discord:
        return "Discord";
    }
  };

  const computeSelectedField = (row: IQuestAnalyticsWinners) => {
    switch (seelctedField) {
      case ESelectedField.email:
        return row.emailUserEmail;
      case ESelectedField.twitter:
        return row.twitterUsername;
      case ESelectedField.telegram:
        return row.telegramUsername;
      case ESelectedField.discord:
        return row.discordUsername;
    }
  };

  const handleClick = (field: ESelectedField) => {
    setSelectedField(field);
    setOpen(false);
  };

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  const columnsCount = questType === EProjectType.Scoreboard ? 5 : 4;

  return (
    <Paper sx={{ overflow: "hidden", background: "transparent" }}>
      {data && (
        <>
          {data.length ? (
            <TableContainer
              sx={{ px: 2.5, pb: 2.5, maxHeight: 440 }}
              className={"table-container"}
            >
              <Table
                stickyHeader
                sx={{
                  minWidth: 650,
                  th: {
                    width: `${100 / columnsCount}%`,
                  },
                }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <p className={"c-font-color c-font-15-16 c-fw-500"}>
                        <Trans id={"dlfg34j-bdfn23-sdnbeljbgf-User"}>
                          User
                        </Trans>
                      </p>
                    </TableCell>
                    <TableCell align="left">
                      <p className={"c-font-color c-font-15-16 c-fw-500"}>
                        <Trans id={"dlfg34j-bdfn23-sdnbeljbgf"}>Wallet</Trans>
                      </p>
                    </TableCell>
                    <TableCell style={{ zIndex: 2 }} align="left">
                      <Box position={"relative"} ref={ref}>
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          onClick={() => setOpen(true)}
                          className={
                            "c-font-color c-font-15-16 c-fw-500 c-pointer"
                          }
                        >
                          <p> {computeSelectedFieldTitle()}</p>
                          <Box
                            ml={1}
                            sx={{
                              transform: !open
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.3s ease-in-out",
                            }}
                          >
                            <Icon name={"chevron-bottom"} size={"20"} />
                          </Box>
                        </Box>
                        {open && (
                          <Box>
                            <AccountDropdown
                              style={{
                                maxHeight:
                                  tableBodyRef.current &&
                                  tableBodyRef.current.offsetHeight,
                              }}
                              className={"quest-analytics__socials-dropdown"}
                            >
                              <Button
                                style="ghost"
                                onClick={() =>
                                  handleClick(ESelectedField.email)
                                }
                                className="c-font-color button"
                              >
                                Email
                              </Button>

                              <Box className="divider" />

                              <Button
                                style="ghost"
                                onClick={() =>
                                  handleClick(ESelectedField.twitter)
                                }
                                className="c-font-color button"
                              >
                                Twitter
                              </Button>
                              <Box className="divider" />

                              <Button
                                style="ghost"
                                onClick={() =>
                                  handleClick(ESelectedField.discord)
                                }
                                className="c-font-color button"
                              >
                                Discord
                              </Button>
                              <Box className="divider" />

                              <Button
                                style="ghost"
                                onClick={() =>
                                  handleClick(ESelectedField.telegram)
                                }
                                className="c-font-color button"
                              >
                                Telegram
                              </Button>
                            </AccountDropdown>
                          </Box>
                        )}
                      </Box>
                    </TableCell>

                    {questType === EProjectType.Scoreboard && (
                      <TableCell align="left">
                        <p className={"c-font-color c-font-15-16 c-fw-500"}>
                          <Trans id={"2-43r-dlfg34j-bdfn23-sdnbeljbgf-Status"}>
                            Place
                          </Trans>
                        </p>
                      </TableCell>
                    )}

                    <TableCell align="left">
                      <p className={"c-font-color c-font-15-16 c-fw-500"}>
                        <Trans id={"dlfg34j-bdfn23-sdnbeljbgf-Status"}>
                          Claiming Status
                        </Trans>
                      </p>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody ref={tableBodyRef}>
                  {data.map((row, index) => (
                    <TableRow
                      key={row.walletAddress}
                      sx={{
                        height: 100,
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align={"left"} component="th">
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"left"}
                        >
                          {row.experienceLevelImage && (
                            <Image
                              width={40}
                              height={40}
                              style={{ borderRadius: "50%" }}
                              src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${row.experienceLevelImage}`}
                              alt={row.experienceLevelId}
                            />
                          )}
                          <Box
                            component={"p"}
                            ml={1}
                            className={"c-font-color c-font-16-18 c-fw-400"}
                          >
                            {row.username}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <Box display={"flex"} alignItems={"center"} gap={"5px"}>
                          <p
                            className={
                              "c-font-color c-font-16-18 c-fw-400 quest-analytics__wallet"
                            }
                          >
                            {row.walletAddress || "-"}
                          </p>
                          {row.walletAddress && (
                            <CopyToClipboard
                              text={row.walletAddress}
                              onCopy={() => setCopiedIndex(index)}
                            >
                              <Icon
                                className="icon c-font-color-3 c-pointer"
                                name={
                                  copiedIndex === index
                                    ? "check-mark"
                                    : "account-copy"
                                }
                                size={copiedIndex === index ? "18" : "18"}
                              />
                            </CopyToClipboard>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <Box className={"c-font-color c-font-16-18 c-fw-400"}>
                          {computeSelectedField(row) || "-"}
                        </Box>
                      </TableCell>

                      {questType === EProjectType.Scoreboard && (
                        <TableCell align="left">
                          <p className={"c-font-color c-font-16-18 c-fw-400"}>
                            {getOrdinal(+row.place)}
                          </p>
                        </TableCell>
                      )}
                      <TableCell align="left">
                        <Box
                          sx={{
                            opacity: row.isClaimed ? 1 : 0.5,
                          }}
                          className={"c-font-color c-font-16-18 c-fw-400"}
                        >
                          {row.isClaimed ? (
                            <Box display={"flex"} alignItems={"center"}>
                              <Trans id={"vldfknbj4-1lkjndfb-dfblnfb"}>
                                Claimed
                              </Trans>
                              <Icon
                                name={"check-mark"}
                                size={"18"}
                                className={"c-font-color-3"}
                              />
                            </Box>
                          ) : (
                            <Trans id={"vdnfvjkdfnbd-dfbndfjb-2ldfnjfd"}>
                              Not Claimed
                            </Trans>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              height={150}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              borderRadius={"16px"}
              border={"1px solid rgba(255, 255, 255, 0.50)"}
            >
              <Box
                sx={{ opacity: 0.5 }}
                className={"c-font-color c-font-22-22 c-fw-500"}
              >
                {dataExist ? (
                  <Trans id={"svlng24-3f2ljevnf-dbjn2-not-found"}>
                    User not found
                  </Trans>
                ) : (
                  <Trans id={"svlng24-fdlknb-dsvlnd-No-winner"}>
                    There are no winners in the quest yet
                  </Trans>
                )}
              </Box>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};
