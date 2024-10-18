import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppContext, LANGUAGES, TranslatorContext } from "@context";
import { DateTime } from "luxon";
import { bunnerDayEnd } from "@models";
import OneSignal from "react-onesignal";
import { useRouter } from "next/router";
import { Footer } from "@components/footer";
import { Scroll } from "@components/UI/scroll";
import { CBreakpoints } from "@styles/variables";
import { useWalletConnect, useWindowSize } from "@hooks";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountState } from "@modules/account/store/account.selector";
import {
  getIsBannerClosed,
  getSystemState,
} from "@store/slices/system/system.selector";
import { useContextSelector } from "use-context-selector";
import { getAnalyticsState } from "@store/slices/analytics/analytics.selector";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { disconnectAccountThunk } from "@modules/account/store/account.thunks";

import { AccountSidebar } from "@components/accountSidebar";
import { Header } from "@components/header";
import { Sidebar } from "@components/sidebar";

import st from "@styles/app.module.css";
import { CookiePopup } from "@/components/cookiePopup";
import { RestrictionForCreationPopup } from "@/components/restrictionForCreationPopup";
import { RestrictionForWalletPopup } from "@/components/restrictionForWalletPopup";
import { InviteReferralsPopup } from "@/components/inviteReferralsPopup";
import { ReferralPopupResult } from "@/components/referralPopupResult";
import { WalletsPopup } from "@/components/walletsPopup";
import { OnboardingPopup } from "@/components/onboardingPopup";
import { CreateQuestPopup } from "@/components/createQuestPopup";
import { appConfig } from "@/app.config";
import { Banner } from "@/components/banner";
import {
  setIsAnalyticsEventPropsLoaded,
  setPrevLocation,
} from "@/store/slices/analytics/analytics.slice";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { setIsRestrictionForCreationPopupOpen } from "@/modules/account/store/account.slice";
import { LocalStorageService } from "@/services";
import { DisconnectWalletPopup } from "@/components/disconnectWalletPopup";
import { IframeAuthPopup } from "@/components/iframeAuthPopup";
import { PreviewPanel } from "@/components/previewPanel";
import { PartnerProjectCreationPopup } from "@/components/partnerProjectCreationPopup";
import { PageLoader } from "@/components/pageLoader";
import { DisclaimerPopup } from "@/components/disclaimerPopup";
import { setDisclaimerPopupOpen } from "@/store/slices/system/system.slice";
import { ChatWithUs } from "@components/UI/ChatWithUs/ChatWithUs";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { NotificationsToastMobile } from "@components/Notifications/NotificationsToastMobile";
import { AllNotificationsPopup } from "@components/Notifications/AllNotificationsPopup";
import { setIsNotificationsMuted } from "@store/slices/notifications/notifications.slice";
import { muteNotificationsKey } from "@context/notifications";
import { ExperienceFinishTourModal } from "@modules/account/components/experience/experienceFinishTour/ExperienceFinishTourModal";
import { AcceptPartnerProjectPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/AcceptPartnerProjectPopup";
import { AcceptPartnerPAcceptPartnerProjectNotConnectedPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/AcceptPartnerProjectNotConnectedPopup";
import { AcceptPartnerPAcceptPartnerProjectConnectedPopup } from "@modules/quest/components/inviteToPartnerProjectPopup/AcceptPartnerProjectConnectedPopup";

interface IProps {
  Component: any;
  props: any;
  isLoading: boolean;
}

export const MainLayout: FC<IProps> = ({ Component, props, isLoading }) => {
  const scrollTo = useRef(null);
  const router = useRouter();

  const [pageHandled, setPageHandled] = useState(null);

  const dispatch = useAppDispatch();
  const { isAccountLoaded } = useTypedSelector(getAccountState);
  const isBannerClosed = useTypedSelector(getIsBannerClosed);
  const { theme } = useTypedSelector(getSystemState);
  const isSm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.md),
  );

  const { userMetaData, isAnalyticsDataLoaded, isEventPropsLoaded } =
    useTypedSelector(getAnalyticsState);

  const { disconnect: disconnectWallet } = useWalletConnect();

  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );

  const language = useContextSelector(
    TranslatorContext,
    state => state.language,
  );

  useEffect(() => {
    if (language === LANGUAGES.uk.value) {
      document.documentElement.style.setProperty(
        "--font-family-1",
        "var(--plex-sans)",
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family-1",
        "var(--space-grotesk)",
      );
    }
  }, [language]);

  useEffect(() => {
    dispatch(
      setIsNotificationsMuted(
        LocalStorageService.getItem(muteNotificationsKey) === "true",
      ),
    );

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isShowBunner = useMemo(() => {
    const endDateTimestamp = DateTime.fromISO(bunnerDayEnd);
    const today = DateTime.now();
    const dayDifference = Math.ceil(endDateTimestamp.diff(today, "days").days);

    return dayDifference > 0;
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    (async () => {
      if (
        typeof window == "undefined" &&
        process &&
        appConfig &&
        appConfig.NEXT_PUBLIC_ONE_SIGNAL &&
        typeof window !== "undefined"
      ) {
        await OneSignal.init({
          appId: appConfig.NEXT_PUBLIC_ONE_SIGNAL,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (scrollTo.current && isAnalyticsDataLoaded && isAccountLoaded) {
      if (location.pathname !== "/quest") {
        (scrollTo as any).current(0);
      }
    }
  }, [router, isAnalyticsDataLoaded, isAccountLoaded, dispatch]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent.toLowerCase();
    if (
      ua.includes("telegram") ||
      ua.includes("whatsapp") ||
      ua.includes("viber") ||
      ua.includes("twitter") ||
      ua.includes("discord") ||
      ua.includes("instagram") ||
      ua.includes("tiktok") ||
      ua.includes("fb") ||
      ua.includes("facebook")
    )
      dispatch(
        setIsRestrictionForCreationPopupOpen({
          open: true,
          type: "in-app",
          username: "",
        }),
      );
  }, [dispatch]);

  const firstVisit = useCallback(async () => {
    const visited = Boolean(await LocalStorageService.getItemAsync("visited"));

    if (visited || !isAnalyticsDataLoaded) return;

    dispatch(
      sendAnalyticsDataThunk({
        type: "first_visit",
        options: { event_property_current_page: router.asPath },
      }),
    );

    LocalStorageService.setItem("visited", "true");
  }, [dispatch, isAnalyticsDataLoaded, router]);

  useEffect(() => {
    firstVisit();
  }, [firstVisit]);

  useEffect(() => {
    if (pageHandled === router.asPath) return;

    dispatch(
      sendAnalyticsDataThunk({
        type: "page_visit",
        options: { event_property_current_page: router.asPath },
      }),
    );
    setPageHandled(router.asPath);
  }, [dispatch, router, pageHandled, isEventPropsLoaded, isAccountLoaded]);

  const handleStorageChange = async (e: any) => {
    if (e.key !== "401") {
      return;
    }
    await disconnectWallet();
    await dispatch(disconnectAccountThunk());
  };

  const { width } = useWindowSize();
  const firstTime = useRef<boolean>(true);
  const prevPath = useRef("");
  const prevSubPath = useRef("");

  const handleRouteStartChange = () => {
    if (prevLocation) {
      dispatch(setIsAnalyticsEventPropsLoaded(false));
      prevLocation.current = router.pathname;
      dispatch(setPrevLocation(router.asPath));
    }

    prevPath.current = window.location.pathname.split("/")[1];
    prevSubPath.current = window.location.pathname.split("/")[2];
  };

  const handleRouteCompleteChange = () => {
    const currentLocation = window.location.pathname.split("/")[1];
    const currentSubLocation = window.location.pathname.split("/")[2];

    if (scrollTo.current && prevSubPath.current !== currentSubLocation) {
      (scrollTo as any).current(0);
    }

    if (prevPath.current === currentLocation) {
      return;
    }

    scrollTo.current && (scrollTo as any).current(0);
  };

  const renderMainContent = () => {
    const mainContent = (
      <>
        <Component {...props} />
        {!router.pathname.includes("whitelisting") &&
          !router.pathname.includes("iframe") &&
          !router.pathname.includes("wallet-login") && <Footer />}
      </>
    );

    return (
      <Scroll
        styles={{
          height: router.pathname.includes("wallet-login")
            ? "auto"
            : `calc(100vh - ${
                width >= CBreakpoints.lg ? LgUpHeaderHeight : LgDownHeaderHeight
              }px)`,
        }}
        shouldScrollTop
      >
        {mainContent}
      </Scroll>
    );
  };

  useEffect(() => {
    const dontShow = LocalStorageService.getItem("dp");

    if (dontShow || router.pathname.includes("blog")) return;
    dispatch(setDisclaimerPopupOpen(isAccountLoaded));
  }, [dispatch, router, isAccountLoaded]);

  useEffect(() => {
    if (userMetaData && firstTime.current) {
      firstTime.current = false;
    }

    router.events.on("routeChangeStart", handleRouteStartChange);
    router.events.on("routeChangeComplete", handleRouteCompleteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteStartChange);
      router.events.off("routeChangeComplete", handleRouteCompleteChange);
    };
  }, [userMetaData, router]);

  if (isLoading && !router.pathname.includes("iframe")) {
    return <PageLoader />;
  }

  return (
    <>
      <CookiePopup />
      <div className={st.wrapper} style={{ background: "var(--color-b0)" }}>
        {!isBannerClosed && isShowBunner && <Banner />}
        <RestrictionForCreationPopup />
        <RestrictionForWalletPopup />
        <InviteReferralsPopup />
        <ReferralPopupResult />
        <WalletsPopup />
        <OnboardingPopup />
        <CreateQuestPopup />
        <DisconnectWalletPopup />
        <IframeAuthPopup />
        <PartnerProjectCreationPopup />
        <DisclaimerPopup />
        <AllNotificationsPopup />
        <ExperienceFinishTourModal />
        <AcceptPartnerProjectPopup />
        <AcceptPartnerPAcceptPartnerProjectNotConnectedPopup />
        <AcceptPartnerPAcceptPartnerProjectConnectedPopup />
        <Header />

        <div className={st["content-wrapper"]}>
          {!router.pathname.includes("wallet-login") && (
            <>
              {!router.pathname.includes("whitelisting") && <Sidebar />}
              {<AccountSidebar />}
            </>
          )}

          <div className={st.content}>{renderMainContent()}</div>
        </div>
      </div>

      {router.pathname === "/quest" && (
        <Box right={30} bottom={80} zIndex={999} position={"fixed"}>
          <ChatWithUs />
        </Box>
      )}
      <NotificationsToastMobile />

      <PreviewPanel />
    </>
  );
};

const LgDownHeaderHeight = 58;
const LgUpHeaderHeight = 70;
