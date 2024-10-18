import { Modal } from "@/components/UI/modal";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Wrapper } from "./expHistoryPopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { IExpHistoryItem } from "@/models";
import { accountService } from "@/api";
import { LogoLoader } from "@/components/logoLoader";
import classNames from "classnames";
import { Trans } from "@lingui/macro";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const PER_PAGE = 6;

const ExpHistoryPopup: FC<Props> = ({ isOpen, setIsOpen }) => {
  const [history, setHistory] = useState<IExpHistoryItem[]>([]);
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const pagesCount = useMemo(
    () => Math.ceil(historyCount / PER_PAGE),
    [historyCount],
  );

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  const getHistory = useCallback(async (page?: number) => {
    try {
      setLoading(true);
      const { data } = await accountService.getExpHistory(page || 1, PER_PAGE);
      setHistory(data.data);
      setHistoryCount(data.totalCount);
    } catch (error) {
      console.log("error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getHistory(page);
  }, [getHistory, page]);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={handleClose}>
          <Wrapper className="c-font-color">
            {loading && <LogoLoader className="loader" />}
            <Box className="header c-font-20-24 c-sm-font-24-24 c-fw-500">
              <Trans id="gTGvgynJVRic6wzqXQEZkz-expHistoryPopup">History</Trans>
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={handleClose}
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Box>

            <Box className={classNames("content", { empty: !history.length })}>
              {history.map(item => (
                <Box key={item.id} className="item">
                  <Box className="leftWrapper">
                    <Box
                      sx={{ opacity: 0.7 }}
                      className="dateWrapper c-font-14-22"
                    >
                      {new Date(item.createdAt)
                        .getDate()
                        .toString()
                        .padStart(2, "0")}
                      .
                      {new Date(item.createdAt)
                        .getMonth()
                        .toString()
                        .padStart(2, "0")}
                      .{new Date(item.createdAt).getFullYear()}
                    </Box>

                    <Box className="c-fw-500 c-font-14-22 c-sm-font-16-22">
                      {item.experienceTask.name}
                    </Box>
                  </Box>

                  <Box className="c-font-color-3 c-font-16-24 c-fw-500">
                    <Trans id="e3bVVqeVayfoootyCXsj11-expHistoryPopup">
                      +{item.earnedPoints}XP
                    </Trans>
                  </Box>
                </Box>
              ))}

              {!history.length && (
                <Box className="c-font-22-26 c-fw-500">
                  <Trans id="5KQJNqLpUha3qKtJG9bLXz-expHistoryPopup">
                    You haven&apos;t taken any action yet
                  </Trans>
                </Box>
              )}

              {Boolean(history.length) && (
                <Box mt="20px" display="flex" justifyContent="space-between">
                  <Button
                    onClick={() => setPage(prevState => prevState - 1)}
                    size={"small"}
                    style={"secondary"}
                    disabled={loading || page === 1}
                  >
                    <Icon className={"c-flex"} name={"arrow-keyboard-left"} />
                  </Button>

                  <Button
                    onClick={() => setPage(prevState => prevState + 1)}
                    size={"small"}
                    style={"secondary"}
                    disabled={loading || page === pagesCount}
                  >
                    <Icon className={"c-flex"} name={"arrow-keyboard-right"} />
                  </Button>
                </Box>
              )}
            </Box>
          </Wrapper>
        </Modal>
      )}
    </>
  );
};

export default ExpHistoryPopup;
