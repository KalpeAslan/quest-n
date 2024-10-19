import styled from "@emotion/styled";
import Link from "next/link";

const FooterStylesWrapper = styled.div`
  margin-bottom: 1px;
  box-shadow: 0 0 6px var(--header-box-shadow-color);
  z-index: 2;
  position: fixed;
  bottom: 50px;
  right: 0;
  left: 0;
  background: var(--footer-background-color);
`;

const FooterStylesFooter = styled.footer`
  padding-top: 40px !important;
  padding-bottom: 120px !important;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  background-color: var(--footer-background-color);

  @media (min-width: 1200px) {
    padding-top: 48px !important;
    padding-bottom: 48px !important;
  }
`;

const FooterStylesSection = styled.div`
  width: 100%;

  &.bl1 {
    order: 0;
  }

  &.email {
    order: 1;
  }

  &.bl2 {
    order: 2;
  }

  &.bl3 {
    order: 3;
  }

  @media (min-width: 768px) {
    width: auto;

    &.bl1 {
      width: 100%;
    }

    &.email {
      flex: 2;
      order: 3;
    }

    &.bl2 {
      flex: 1;
      order: 1;
    }

    &.bl3 {
      flex: 1;
      order: 2;
    }
  }

  @media (min-width: 1024px) {
    width: auto;

    &.bl1,
    &.bl2,
    &.bl3,
    &.email {
      flex: 1;
    }

    &.email {
      width: 100%;
      max-width: 320px;
    }
  }
`;

const FooterStylesLogo = styled(Link)`
  margin-bottom: 12px;
  display: block;
  color: var(--footer-logo-color);
`;

const FooterStylesCopyrightText = styled.span`
  color: var(--footer-nav-color);
`;

const FooterStylesNav = styled.div`
  display: flex;
`;

const FooterStylesLink = styled.a`
  color: var(--footer-nav-color);
  text-decoration: underline;
  transition: color 0.3s;

  &:hover {
    color: var(--text-link-color);
    text-decoration: none;
  }
`;

const FooterStylesDivider = styled.p`
  margin: 0 0.3rem;
  color: var(--footer-nav-color);
`;

const FooterStylesTitle = styled.h3`
  margin-bottom: 12px;
  color: var(--footer-title-color);
`;

export {
  FooterStylesFooter,
  FooterStylesWrapper,
  FooterStylesDivider,
  FooterStylesLink,
  FooterStylesLogo,
  FooterStylesNav,
  FooterStylesSection,
  FooterStylesTitle,
  FooterStylesCopyrightText,
};
