import * as React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";

import { createEmotionCache } from "../lib/createEmotionCache";
import { randomBytes } from "crypto";
import Script from "next/script";
import { appConfig } from "@/app.config";
import {
  DEFAULT_META_DESCRIPTION_EN,
  DEFAULT_META_DESCRIPTION_UK,
} from "@/models/constants";

export default class MyDocument extends Document {
  render() {
    let csp = `
      connect-src 'self' https://jsonip.com/ ${
        appConfig.NEXT_PUBLIC_BLOG_HOST
      } ${appConfig.NEXT_PUBLIC_APP_API_HOST} ${
      appConfig.NEXT_PUBLIC_APP_ANALYTICS_HOST
    } http://*.hotjar.com:* https://*.hotjar.com:* http://*.hotjar.io/ https://*.hotjar.io/ wss://*.hotjar.com/ https://translate.googleapis.com/ https://translate.google.com/ https://api.country.is/;
      style-src 'self' https://fonts.googleapis.com https://translate.googleapis.com/ 'unsafe-inline';
      img-src 'self' data: 0.gravatar.com/ secure.gravatar.com/ encrypted-tbn0.gstatic.com/ ${
        appConfig.NEXT_PUBLIC_BLOG_HOST
      } http://*.hotjar.com/ https://*.hotjar.com/ http://*.hotjar.io/ https://*.hotjar.io/ https://www.gstatic.com/ https://www.google.com/ https://translate.googleapis.com/ http://translate.google.com/;
      script-src 'self' ${
        appConfig.NODE_ENV == "production" ? "" : "'unsafe-eval'"
      } https://www.google.com/recaptcha/ https://translate.googleapis.com/ https://translate.google.com/ https://translate-pa.googleapis.com/ 'nonce-${
      (this.props as any).nonce
    }' 'strict-dynamic' static.hotjar.com http://*.hotjar.com https://*.hotjar.com/ http://*.hotjar.io/ https://*.hotjar.io/;
      font-src 'self' fonts.gstatic.com http://*.hotjar.com/ https://*.hotjar.com/ http://*.hotjar.io/ https://*.hotjar.io/;
      frame-src https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.youtube.com/ https://vars.hotjar.com/ https://*.hotjar.com/ http://*.hotjar.io/ https://*.hotjar.io/;
    `;

    return (
      <Html lang={this.props.__NEXT_DATA__.locale || "en"}>
        <Head>
          <meta charSet="utf-8" />
          {/*<link rel="icon" href="%PUBLIC_URL%/favicon.ico"/>*/}
          {/*              <meta name="viewport" content="width=device-width, initial-scale=1"/>*/}
          {/*              <meta name="theme-color" content="#000000"/>*/}
          {/*              <meta httpEquiv="Content-Security-Policy" content={csp} />*/}

          <meta
            name="description"
            content={
              this.props.__NEXT_DATA__.locale === "en"
                ? DEFAULT_META_DESCRIPTION_EN
                : DEFAULT_META_DESCRIPTION_UK
            }
          />
          {/* <meta name="referrer" content="origin" /> */}
          {/* <meta httpEquiv="Content-Security-Policy" content={csp} /> */}

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin={""}
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          {/* <!-- Google tag (gtag.js) --> */}
          <Script
            strategy="afterInteractive"
            async
            src="https://www.googletagmanager.com/gtag/js?id=AW-11060075425"
          ></Script>
          <Script strategy="afterInteractive" id="gtm">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${appConfig.NEXT_PUBLIC_GATAG}');`}
          </Script>

          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          {/* <script src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"></script> */}

          {/* <script
            dangerouslySetInnerHTML={{
              __html: `
                var vConsole = new window.VConsole();
              `,
            }}
          /> */}

          {/* <!-- Meta Pixel Code --> */}
          <Script strategy="afterInteractive" id="facebook-pixel">
            {`!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${appConfig.NEXT_PUBLIC_FB_PIXEL}');
              fbq('track', 'PageView');`}
          </Script>

          {/* <!-- End Meta Pixel Code --> */}

          {/* <link rel="manifest" href="/manifest.json" /> */}
          <link
            rel="alternate"
            hrefLang="x-default"
            href={appConfig.SITE_URL}
          />
          <link rel="alternate" hrefLang="en" href={appConfig.SITE_URL} />
          <link
            rel="alternate"
            hrefLang="uk"
            href={`${appConfig.SITE_URL}/uk`}
          />
        </Head>
        <body>
          <Main />
          <div id="my-portal" />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  /* eslint-disable */
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) => props =>
        <App emotionCache={cache} {...props} />,
    });
  /* eslint-enable */

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map(style => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  const nonce = randomBytes(128).toString("base64");

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
    nonce,
  };
};
