import classnames from "classnames";
import { Icon } from "@components/UI/icon";
import { PATHS, IMenuItem } from "@models";

import { SidebarStylesIcon, SidebarStylesSubmenu } from "../../sidebar.styles";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { setIsMenuOpen } from "@store/slices/system/system.slice";
import { Trans } from "@lingui/macro";

type Props = {
  openedMenu: number | null;
  link: IMenuItem;
  handleOpenMenu: (id: number) => void;
  status: "active" | "new" | "soon";
};

const Sublinks = ({ openedMenu, link, status, handleOpenMenu }: Props) => {
  const dispatch = useAppDispatch();
  const { pathname } = useRouter();

  return (
    <>
      {(status === "active" || status === "new") && (
        <>
          <button
            className={classnames(
              {
                active:
                  openedMenu === link.id ||
                  link.id === (PATHS as any)[pathname],
              },
              "c-button-main c-font-14-24",
            )}
            type="button"
            onClick={() => handleOpenMenu(link.id)}
          >
            {link.icon && <Icon size="24" name={link.icon} />}

            {link.title}

            {link.id !== (PATHS as any)[pathname] && (
              <SidebarStylesIcon
                opened={openedMenu === link.id}
                name="menu-select"
                size="24"
              />
            )}
          </button>

          {(openedMenu === link.id || link.id === (PATHS as any)[pathname]) && (
            <SidebarStylesSubmenu>
              {link.sublist &&
                link.sublist.map(sublink => (
                  <li key={sublink.id}>
                    {sublink.type === "self" && (
                      <Link
                        // @ts-ignore
                        href={sublink.path}
                        target="_self"
                        // className={sublink =>
                        //   classnames(
                        //     { [st.active]: sublink.isActive },
                        //     "c-font-14-17",
                        //   )
                        // }
                        onClick={() => {
                          if (sublink.closeMenu) {
                            dispatch(setIsMenuOpen(false));
                          }
                        }}
                      >
                        <span>{sublink.title}</span>
                      </Link>
                    )}

                    {(sublink.type === "redirect" ||
                      sublink.type === "reopen") && (
                      <Link
                        className="c-font-14-17"
                        href={sublink.path}
                        target={link.type === "redirect" ? "_blank" : "_self"}
                        rel="noreferrer"
                        onClick={() => {
                          if (sublink.closeMenu) {
                            dispatch(setIsMenuOpen(false));
                          }
                        }}
                      >
                        <span>{sublink.title}</span>
                      </Link>
                    )}
                  </li>
                ))}
            </SidebarStylesSubmenu>
          )}
        </>
      )}

      {status === "soon" && (
        <p className="c-button-main c-button-disabled c-font-14-24">
          {link.icon && <Icon size="24" name={link.icon} />}

          {link.title}

          <span className="c-button-disabled-soon c-font-12-15">
            <Trans id="uPczBPtckRqEM4Ad7Uhdrx-sidebar">SOON</Trans>
          </span>
        </p>
      )}
    </>
  );
};

export default Sublinks;
