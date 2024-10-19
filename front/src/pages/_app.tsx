import { CacheProvider, ThemeProvider } from "@emotion/react";
import { Cookies, CookiesProvider } from "react-cookie";
import "wagmi/window";

import { createEmotionCache } from "@/lib/createEmotionCache";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
  AppProvider,
  DEFAULT_LOCALE,
  ErrorBoundary,
  TranslatorProvider,
  WagmiProvider,
} from "@context";
import { useRouter } from "next/router";
import "../styles/global.css";
import TagManager from "react-gtm-module";
import { install } from "ga-gtag";
import { hotjar } from "react-hotjar";
import { LoggerService } from "@services";
import { i18n } from "@lingui/core";
import { en, uk, ru } from "make-plural";

import "react-phone-number-input/style.css";

import { CssBaseline } from "@mui/material";
import { MainLayout } from "@/layouts/MainLayout";
import { Provider } from "react-redux";
import { store } from "@store/store";

import { ApolloProvider } from "@apollo/client";
import { client } from "@/utils";
import "nprogress/nprogress.css";
import NProgress from "nprogress";

import "lazysizes";
import "overlayscrollbars/overlayscrollbars.css";
import "@splidejs/react-splide/css/core";
import { appConfig } from "@/app.config";
import getConfig from "next/config";
import Head from "next/head";
import { setEvaDav } from "@/lib/evaDav";
import { Icons } from "@components/UI/icons";
import App, { AppContext } from "next/app";
import { NotificationsProvider } from "@context/notifications";
import {
  getDefaultMetaDescription,
  getDefaultMetaTitle,
} from "@/utils/getDefaultMetaTags";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import {TelegramProvider} from "@context/tg";

const clientSideEmotionCache = createEmotionCache();

i18n.loadLocaleData({
  en: { plurals: en },
  uk: { plurals: uk },
  ru: { plurals: ru },
});

const { publicRuntimeConfig } = getConfig();

i18n.load(DEFAULT_LOCALE, publicRuntimeConfig[DEFAULT_LOCALE].messages);
i18n.activate(DEFAULT_LOCALE);

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-family-1)",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1280,
      xl: 1440,
    },
  },
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#2F2F2F",
        },
      },
    },
  },
});

if (
  (appConfig.NEXT_PUBLIC_ENVIRONMENT === "prod" ||
    appConfig.NEXT_PUBLIC_ENVIRONMENT === "stage") &&
  typeof window !== "undefined"
) {
  if (process && appConfig) {
    if (appConfig.NEXT_PUBLIC_GTM) {
      const gtmId = appConfig.NEXT_PUBLIC_GTM || "";

      TagManager.initialize({ gtmId });
    }
  }

  if (process && appConfig && appConfig.NEXT_PUBLIC_GTAG) {
    install(appConfig.NEXT_PUBLIC_GTAG);
  }

  if (process && appConfig && appConfig.NEXT_PUBLIC_HJID) {
    const hjid = +appConfig.NEXT_PUBLIC_HJID;

    hotjar.initialize(hjid, hjid);
    LoggerService.log("GTM and Hotjar are initialised");
  }
}

const MyApp = props => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    cookies,
    defaultDescription,
    defaultTitle,
  } = props;

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const onRouteChangeStart = () => {
    NProgress.start();
  };

  const onRouteChangeComplete = () => {
    setIsLoading(false);
    NProgress.done();
  };

  const onRouteChangeError = () => {
    setIsLoading(false);
    NProgress.done();
  };

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    router.events.on("routeChangeStart", onRouteChangeStart);
    router.events.on("routeChangeComplete", onRouteChangeComplete);
    router.events.on("routeChangeError", onRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
      router.events.off("routeChangeComplete", onRouteChangeComplete);
      router.events.off("routeChangeError", onRouteChangeError);
    };
  }, [router]);

  useEffect(() => {
    setEvaDav();
  }, []);

  return (
    <>
      <Head>
        <title>{getDefaultMetaTitle(router.locale)}</title>
        <meta
          name="description"
          content={getDefaultMetaDescription(router.locale)}
        />
        <link rel="canonical" href={pageProps?.link || "/"} />

        {/* Google */}
        <meta itemProp="name" content={getDefaultMetaTitle(router.locale)} />
        <meta
          itemProp="description"
          content={getDefaultMetaDescription(router.locale)}
        />
        <meta itemProp="image" content="/preview.webp" />

        {/* Facebook */}
        <meta
          property="og:title"
          content={getDefaultMetaTitle(router.locale)}
        />
        <meta
          property="og:description"
          content={getDefaultMetaDescription(router.locale)}
        />
        <meta property="og:image" content="/preview.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="/preview.webp" />
        <meta
          name="twitter:title"
          content={getDefaultMetaTitle(router.locale)}
        />
        <meta
          name="twitter:description"
          content={getDefaultMetaDescription(router.locale)}
        />
        <meta name="twitter:image" content="/preview.webp" />
      </Head>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <TranslatorProvider>
            <CacheProvider value={emotionCache}>
              <CookiesProvider
                cookies={
                  typeof window !== "undefined"
                    ? undefined
                    : new Cookies(cookies)
                }
              >
                <MuiThemeProvider theme={theme}>
                  <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <WagmiProvider>
                      <GoogleReCaptchaProvider
                        reCaptchaKey={
                          appConfig.NEXT_PUBLIC_APP_RECAPTCHA_V3_INVISIBLE_PUBLIC
                        }
                      >
                        <AppProvider>

                          <NotificationsProvider>
                            <ErrorBoundary>
                              <TelegramProvider>
                                <Icons />
                                <MainLayout
                                    Component={Component}
                                    props={{ ...pageProps }}
                                    isLoading={isLoading}
                                />
                              </TelegramProvider>
                            </ErrorBoundary>
                          </NotificationsProvider>
                        </AppProvider>
                      </GoogleReCaptchaProvider>
                    </WagmiProvider>
                  </ThemeProvider>
                </MuiThemeProvider>
              </CookiesProvider>
            </CacheProvider>
          </TranslatorProvider>
        </Provider>
      </ApolloProvider>
    </>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    cookies: appContext.ctx.req?.headers.cookie,
    defaultDescription: getDefaultMetaDescription(appContext.router.locale),
    defaultTitle: getDefaultMetaTitle(appContext.router.locale),
  };
};

export default MyApp;
