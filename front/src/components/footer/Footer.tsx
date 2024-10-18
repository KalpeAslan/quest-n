import { useMemo } from "react";
import { Box } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import { DateTime } from "luxon";

import { ELinks, IMenuLink } from "@models";
import { Icon } from "@components/UI/icon";
import { SocialMedia } from "@components/socialMedia";
import { Subscription } from "@components/subscription";

import { Menu } from "./components/menu";

import {
  FooterStylesDivider,
  FooterStylesSection,
  FooterStylesNav,
  FooterStylesLogo,
  FooterStylesLink,
  FooterStylesTitle,
  FooterStylesCopyrightText,
  FooterStylesWrapper,
  FooterStylesFooter,
} from "./footer.styles";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getIsAdminCreatePageOpened } from "@/store/slices/system/system.selector";
import { setChangesWarningPopupPath } from "@/store/slices/system/system.slice";

const Footer = () => {
  const PRODUCTS_LINKS: IMenuLink[] = [
    {
      id: 3,
      path: "/quest",
      title: t({ id: "uFShwEzxEeLt6rToMy2KvH-Footer", message: "AlphaQuest" }),
      disabled: false,
      type: "self",
    },
    {
      id: 4,
      path: "/games",
      title: "Games",
      disabled: false,
      type: "self",
    },
  ];

  const KNOWLEDGE_BASE_LINKS: IMenuLink[] = [
    {
      id: 3,
      path: "/blog",
      title: t({ id: "2qqr2ofPYzaZpxzhrnRHcx-Footer", message: "Blog" }),
      disabled: false,
      type: "reopen",
    },
    {
      id: 5,
      path: ELinks.youtube,
      title: t({ id: "jtqu8k6wh9zU6NsDKgXgAX-Footer", message: "Videos" }),
      disabled: false,
      type: "redirect",
    },
    {
      id: 4,
      path: ELinks.verifyAmbassador,
      title: t({
        id: "23sbhW8YaYa8smpqKLVnvT5t-Footer",
        message: "Verify Ambassador",
      }),
      disabled: false,
      type: "self",
    },
  ];

  const dispatch = useAppDispatch();

  const adminCreatePageOpened = useTypedSelector(getIsAdminCreatePageOpened);

  const currentYear = useMemo(() => {
    return DateTime.now().year;
  }, []);

  return (
    <FooterStylesWrapper>
      <FooterStylesFooter className={"c-wrap"}>
        <FooterStylesSection className={"bl1"}>
          <FooterStylesLogo
            href="/"
            onClick={e => {
              if (adminCreatePageOpened) {
                e.preventDefault();
                dispatch(setChangesWarningPopupPath("/"));
              }
            }}
          >
            <Icon name="logo" height="24" width="140" />
          </FooterStylesLogo>

          <FooterStylesCopyrightText className={"c-font-12-16"}>
            © {currentYear}{" "}
            <Trans id="g9S6V4D1RzAmEJCf7NGMnC-footer">AlphaGuilty.</Trans>
          </FooterStylesCopyrightText>

          <FooterStylesNav className={"c-font-12-16"}>
            <FooterStylesLink
              href="/terms-and-condition"
              onClick={e => {
                if (adminCreatePageOpened) {
                  e.preventDefault();
                  dispatch(setChangesWarningPopupPath("/terms-and-condition"));
                }
              }}
            >
              <Trans id="hGAQT3uud8k8ntfZekKfn8-footer">Terms of Service</Trans>
            </FooterStylesLink>

            <FooterStylesDivider>|</FooterStylesDivider>

            <FooterStylesLink
              href="/privacy-policy"
              className={"c-font-12-16"}
              onClick={e => {
                if (adminCreatePageOpened) {
                  e.preventDefault();
                  dispatch(setChangesWarningPopupPath("/privacy-policy"));
                }
              }}
            >
              <Trans id="r2rRztxfoeDeXVCZCLbLT1-footer">Privacy Policy</Trans>
            </FooterStylesLink>
          </FooterStylesNav>

          <FooterStylesLink
            href="/cookies-policy"
            className="c-font-12-16"
            onClick={e => {
              if (adminCreatePageOpened) {
                e.preventDefault();
                dispatch(setChangesWarningPopupPath("/cookies-policy"));
              }
            }}
          >
            <Trans id="jeWzMq9hH8wJzhZRRL9jJc-footer">Cookies Policy</Trans>
          </FooterStylesLink>
        </FooterStylesSection>

        <FooterStylesSection className={"bl2"}>
          <FooterStylesTitle className={"c-font-16-22"}>
            <Trans id="rfwMPofLFGTLHdzucZZ7Vp-footer">Product</Trans>
          </FooterStylesTitle>

          <Menu links={PRODUCTS_LINKS} />
        </FooterStylesSection>

        <FooterStylesSection className={"bl3"}>
          <FooterStylesTitle className={"c-font-16-22"}>
            <Trans id="76ufnSVeimvELk8FaxkQ15-footer">AlphaAcademy</Trans>
          </FooterStylesTitle>

          <Menu links={KNOWLEDGE_BASE_LINKS} />
        </FooterStylesSection>

        <FooterStylesSection className={"email"}>
          <FooterStylesTitle className={"c-font-16-22"}>
            <Trans id="4szFQtRUiUCNSj6kgM6fGK-footer">
              Subscribe to our newsletter
            </Trans>
          </FooterStylesTitle>

          <Subscription />

          <Box mt={1.5}>
            <SocialMedia
              size="20"
              twitter={ELinks.twitter}
              telegram={ELinks.telegram}
              discord={ELinks.discord}
              tiktok={ELinks.tiktok}
              youtube={ELinks.youtube}
            />
          </Box>
        </FooterStylesSection>
      </FooterStylesFooter>
    </FooterStylesWrapper>
  );
};

export default Footer;
