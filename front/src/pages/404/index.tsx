import { InfoCard } from "@components/infoCard";
import { NextPage } from "next";
import { t } from "@lingui/macro";
import Head from "next/head";

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>Not found</title>
        <link rel="canonical" href="/404" />
      </Head>

      <InfoCard
        title={t({
          id: "1XnP4Lh9LRh8ZHfdFGGu5R-404",
          message: "Page not found...",
        })}
        subTitle={t({
          id: "kYLqKZ4piEUvWyxaSG6DdP-404",
          message: "Sorry, the page you are looking for doesn't exist",
        })}
        subTitle2={t({
          id: "pZbsFkbbUFxSdv2WXqCQgH-404",
          message: "or has been moved.",
        })}
        href="/"
        actionName={t({
          id: "bMXjFudQssFbCF8fMTGfMC-404",
          message: "Back to Homepage",
        })}
      />
    </>
  );
};

export default NotFound;
