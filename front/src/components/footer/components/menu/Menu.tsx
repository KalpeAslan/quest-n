import classnames from "classnames";

import { IMenuLink } from "@models";

import { useRouter } from "next/router";
import Link from "next/link";
import { FooterMenuStylesMenu, FooterMenuStylesSoon } from "./menu.styles";
import { Trans } from "@lingui/macro";
import { setChangesWarningPopupPath } from "@/store/slices/system/system.slice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getIsAdminCreatePageOpened } from "@/store/slices/system/system.selector";

type Props = {
  links: IMenuLink[];
};

const Menu = ({ links }: Props) => {
  const { pathname } = useRouter();

  const dispatch = useAppDispatch();

  const adminCreatePageOpened = useTypedSelector(getIsAdminCreatePageOpened);

  return (
    <FooterMenuStylesMenu>
      {links.map(link => (
        <li key={link.id}>
          {link.disabled && (
            <p
              className={"footer_menu__link footer_menu__disabled c-font-16-22"}
            >
              {link.title}

              <FooterMenuStylesSoon className={"c-font-16-22"}>
                <Trans id="56umoELf6xChfjMhXTvrkq-menu">( soon )</Trans>
              </FooterMenuStylesSoon>
            </p>
          )}

          {!link.disabled && link.type === "self" && (
            <Link
              href={link.path}
              onClick={e => {
                if (adminCreatePageOpened) {
                  e.preventDefault();
                  dispatch(setChangesWarningPopupPath(link.path));
                }
              }}
              className={classnames(
                // { [st.active]: linkData.isActive },
                "footer_menu__link c-font-16-22",
              )}
            >
              {link.title}
            </Link>
          )}

          {!link.disabled &&
            (link.type === "redirect" || link.type === "reopen") && (
              <Link
                className={classnames(
                  { active: pathname === link.path },
                  "footer_menu__link c-font-16-22",
                )}
                href={link.path}
                onClick={e => {
                  if (adminCreatePageOpened) {
                    e.preventDefault();
                    dispatch(setChangesWarningPopupPath(link.path));
                  }
                }}
                target={link.type === "redirect" ? "_blank" : "_self"}
                rel="noreferrer"
              >
                <span>{link.title}</span>
              </Link>
            )}
        </li>
      ))}
    </FooterMenuStylesMenu>
  );
};

export default Menu;
