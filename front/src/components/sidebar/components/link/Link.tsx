import classnames from "classnames";
import { Icon } from "@components/UI/icon";
import { IMenuItem } from "@models";

import { Box } from "@mui/system";
import Link from "next/link";
import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  setChangesWarningPopupPath,
  setIsMenuOpen,
} from "@store/slices/system/system.slice";
import { useRouter } from "next/router";
import { Trans } from "@lingui/macro";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getIsAdminCreatePageOpened } from "@/store/slices/system/system.selector";

type Props = {
  link: IMenuItem;
  status: "active" | "new" | "soon";
};

const SLink = ({ link, status }: Props) => {
  const dispatch = useAppDispatch();

  const adminCreatePageOpened = useTypedSelector(getIsAdminCreatePageOpened);

  const { pathname, asPath } = useRouter();

  return (
    <>
      {(status === "active" || status === "new") && (
        <>
          {link.type === "self" && (
            <Link
              href={link.path}
              className={classnames(
                {
                  active:
                    link.path === "/"
                      ? link.path === pathname
                      : (link.includeSubpaths &&
                          pathname.includes(link.path)) ||
                        asPath === link.path,
                },
                "c-button-main c-font-14-24",
              )}
              onClick={e => {
                dispatch(setIsMenuOpen(false));

                if (adminCreatePageOpened) {
                  e.preventDefault();
                  dispatch(setChangesWarningPopupPath(link.path));
                }
              }}
            >
              {link.icon && <Icon size="24" name={link.icon} />}

              <span>{link.title}</span>

              {status === "new" && (
                <Box
                  component="span"
                  className="c-button-disabled-new c-font-12-15"
                  mr={0.01}
                >
                  <Trans id="nJinTtuhKXkXeDJucxtxwi-sidebar">NEW</Trans>
                </Box>
              )}
            </Link>
          )}

          {(link.type === "redirect" || link.type === "reopen") &&
            (link.type === "redirect" ? (
              "_blank"
            ) : "_self" ? (
              <a
                className="c-button-main c-font-14-24"
                href={link.path}
                target={"_blank"}
                rel="noreferrer"
                onClick={e => {
                  if (link.closeMenu) {
                    dispatch(setIsMenuOpen(false));
                  }

                  if (adminCreatePageOpened) {
                    e.preventDefault();
                    dispatch(setChangesWarningPopupPath(link.path));
                  }
                }}
              >
                {link.icon && <Icon size="24" name={link.icon} />}

                <span>{link.title}</span>
              </a>
            ) : (
              <Link
                className="c-button-main c-font-14-24"
                href={link.path}
                target={"_self"}
                rel="noreferrer"
                onClick={e => {
                  if (link.closeMenu) {
                    dispatch(setIsMenuOpen(false));
                  }

                  if (adminCreatePageOpened) {
                    e.preventDefault();
                    dispatch(setChangesWarningPopupPath(link.path));
                  }
                }}
              >
                {link.icon && <Icon size="24" name={link.icon} />}

                <span>{link.title}</span>
              </Link>
            ))}
        </>
      )}

      {status === "soon" && (
        <Box
          mr={0.01}
          component="span"
          className="c-button-main c-button-disabled c-font-14-24"
        >
          {link.icon && <Icon size="24" name={link.icon} />}

          {link.title}

          <Box
            component="span"
            className="c-button-disabled-soon c-font-12-15"
            mr={0.01}
          >
            <Trans id="aSnyqaL9YjWBxuzwDdwArs-sidebar">SOON</Trans>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SLink;
