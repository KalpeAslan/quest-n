/** @type {import('next').NextConfig} */
const { locales, sourceLocale } = require("./lingui.config.js");
const en = require("./src/locales/en/messages");
const uk = require("./src/locales/uk/messages");
const ru = require("./src/locales/ru/messages");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales,
    defaultLocale: sourceLocale,
  },
  trailingSlash: false,
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.po/,
      use: ["@lingui/loader"],
    });
    return config;
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
    NEXT_PUBLIC_SHORTENER_HOST: process.env.NEXT_PUBLIC_SHORTENER_HOST,
    NEXT_PUBLIC_ENDPOINT_HOST: process.env.NEXT_PUBLIC_ENDPOINT_HOST,
    NEXT_PUBLIC_ANALYTICS_HOST: process.env.NEXT_PUBLIC_ANALYTICS_HOST,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_GTAG: process.env.NEXT_PUBLIC_GTAG,
    NEXT_PUBLIC_GTM: process.env.NEXT_PUBLIC_GTM,
    NEXT_PUBLIC_GATAG: process.env.NEXT_PUBLIC_GATAG,
    NEXT_PUBLIC_FB_PIXEL: process.env.NEXT_PUBLIC_FB_PIXEL,
    NEXT_PUBLIC_HJID: process.env.NEXT_PUBLIC_HJID,
    NEXT_PUBLIC_HJSV: process.env.NEXT_PUBLIC_HJSV,
    NEXT_PUBLIC_RECAPTCHA_INVISIBLE_PUBLIC:
      process.env.NEXT_PUBLIC_RECAPTCHA_INVISIBLE_PUBLIC,
    NEXT_PUBLIC_INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID,
    NEXT_PUBLIC_ONE_SIGNAL: process.env.NEXT_PUBLIC_ONE_SIGNAL,
    SITE_URL: process.env.SITE_URL,
    NEXT_PUBLIC_BLOG_HOST: process.env.NEXT_PUBLIC_BLOG_HOST,
    NEXT_PUBLIC_BLOG_DOMAIN: process.env.NEXT_PUBLIC_BLOG_DOMAIN,
    NEXT_PUBLIC_MAIN_SITE_DOMAIN: process.env.NEXT_PUBLIC_MAIN_SITE_DOMAIN,
    NEXT_PUBLIC_S3_BUCKET: process.env.NEXT_PUBLIC_S3_BUCKET,
    NEXT_PUBLIC_APP_ANALYTICS_HOST: process.env.NEXT_PUBLIC_APP_ANALYTICS_HOST,
    NEXT_PUBLIC_APP_API_HOST: process.env.NEXT_PUBLIC_APP_API_HOST,
    NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC:
      process.env.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    CROWDIN_API_KEY: process.env.CROWDIN_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    NEXT_PUBLIC_INVITE_TG_BOT: process.env.NEXT_PUBLIC_INVITE_TG_BOT,
    NEXT_PUBLIC_INVITE_TG_BOT_CHECKER:
      process.env.NEXT_PUBLIC_INVITE_TG_BOT_CHECKER,
    NEXT_PUBLIC_DISABLE_RECAPTCHA: process.env.NEXT_PUBLIC_DISABLE_RECAPTCHA,
    NEXT_PUBLIC_ADMIN_PANEL_TELEGRAM:
      process.env.NEXT_PUBLIC_ADMIN_PANEL_TELEGRAM,
    NEXT_PUBLIC_ADMIN_PANEL_EMAIL: process.env.NEXT_PUBLIC_ADMIN_PANEL_EMAIL,
    NEXT_PUBLIC_TG_AUTH_BOT: process.env.NEXT_PUBLIC_TG_AUTH_BOT,

    NEXT_PUBLIC_APP_RECAPTCHA_V3_INVISIBLE_PUBLIC:
      process.env.NEXT_PUBLIC_APP_RECAPTCHA_V3_INVISIBLE_PUBLIC,

    // OnChain
    // Polygon
    NEXT_PUBLIC_X89_DEPLOYER_ADDRESS:
      process.env.NEXT_PUBLIC_X89_DEPLOYER_ADDRESS,
    NEXT_PUBLIC_X89_TREASURY_ADDRESS:
      process.env.NEXT_PUBLIC_X89_TREASURY_ADDRESS,

    // Bnb
    NEXT_PUBLIC_X38_DEPLOYER_ADDRESS:
      process.env.NEXT_PUBLIC_X38_DEPLOYER_ADDRESS,
    NEXT_PUBLIC_X38_TREASURY_ADDRESS:
      process.env.NEXT_PUBLIC_X38_TREASURY_ADDRESS,

    // Avalanche
    NEXT_PUBLIC_XA86A_DEPLOYER_ADDRESS:
      process.env.NEXT_PUBLIC_XA86A_DEPLOYER_ADDRESS,
    NEXT_PUBLIC_XA86A_TREASURY_ADDRESS:
      process.env.NEXT_PUBLIC_XA86A_TREASURY_ADDRESS,

    // Arbitrum
    NEXT_PUBLIC_XA4B1_DEPLOYER_ADDRESS:
      process.env.NEXT_PUBLIC_XA4B1_DEPLOYER_ADDRESS,
    NEXT_PUBLIC_XA4B1_TREASURY_ADDRESS:
      process.env.NEXT_PUBLIC_XA4B1_TREASURY_ADDRESS,

    // Optimism
    NEXT_PUBLIC_XA_DEPLOYER_ADDRESS:
      process.env.NEXT_PUBLIC_XA_DEPLOYER_ADDRESS,
    NEXT_PUBLIC_XA_TREASURY_ADDRESS:
      process.env.NEXT_PUBLIC_XA_TREASURY_ADDRESS,

    // Goerli
    NEXT_PUBLIC_X5_DEPLOYER_ADDRESS:
      process.env.NEXT_PUBLIC_X5_DEPLOYER_ADDRESS,
    NEXT_PUBLIC_X5_TREASURY_ADDRESS:
      process.env.NEXT_PUBLIC_X5_TREASURY_ADDRESS,

    en,
    uk,
    ru,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
