import {
  Box,
  MenuItem,
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
import Image from "next/image";
import { appConfig } from "@/app.config";
import { Dropdown } from "@components/UI/dropdown/Dropdown";

interface IProps {
  data: IQuestAnalyticsWinners[];
  dataExist: boolean;
}

export enum ESelectedField {
  email,
  twitter,
  telegram,
  discord,
}

export const QuestAnalyticsEligibleUsers = ({ data, dataExist }: IProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [seelctedField, setSelectedField] = useState<ESelectedField>(
    ESelectedField.email,
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const ref = useRef(null);

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

  useEffect(() => {
    if (copiedIndex !== null) {
      const timeout = setTimeout(() => {
        setCopiedIndex(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [copiedIndex]);

  const handleSelect = (field: ESelectedField) => {
    setSelectedField(field);
    setAnchorEl(null);
  };

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  const columnsCount = 3;

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
                          id="basic-button"
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={handleClick}
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
                        {
                          <Box>
                            <Dropdown
                              id="simple-menu"
                              keepMounted
                              open={open}
                              onClose={handleClose}
                              minWidth={"150px"}
                              anchorEl={anchorEl}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleSelect(ESelectedField.email)
                                }
                                className="c-font-color button"
                              >
                                Email
                              </MenuItem>

                              <Box className="divider" />

                              <MenuItem
                                onClick={() =>
                                  handleSelect(ESelectedField.twitter)
                                }
                                className="c-font-color button"
                              >
                                Twitter
                              </MenuItem>
                              <Box className="divider" />

                              <MenuItem
                                onClick={() =>
                                  handleSelect(ESelectedField.discord)
                                }
                                className="c-font-color button"
                              >
                                Discord
                              </MenuItem>
                              <Box className="divider" />

                              <MenuItem
                                onClick={() =>
                                  handleSelect(ESelectedField.telegram)
                                }
                                className="c-font-color button"
                              >
                                Telegram
                              </MenuItem>
                              <Box className="divider" />
                            </Dropdown>
                          </Box>
                        }
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  ref={tableBodyRef}
                  className={"quest-analytics__socials-dropdown"}
                >
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
                        <p className={"c-font-color c-font-16-18 c-fw-400"}>
                          {computeSelectedField(row) || "-"}
                        </p>
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
                  <Trans id={"svlng2sdf44-fdlknb-dsvlnd-No-winner"}>
                    There are no eligible users in the quest yet
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
