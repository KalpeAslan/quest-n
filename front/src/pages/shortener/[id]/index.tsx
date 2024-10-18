import { useEffect, useState } from "react";

import { Loader } from "@components/UI/loader";
import { shortenerService } from "@api";
import { useRouter } from "next/router";
import Head from "next/head";

const Shortener = () => {
  const { query, replace } = useRouter();
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const getShortenerInfo = async () => {
    if (!query.id) {
      return;
    }

    try {
      const regex = new RegExp(/^https?:\/\//m);
      const { data } = await shortenerService.getShortenerData(
        query.id as string,
      );

      if (data && data.redirectUrl && regex.test(`${data.redirectUrl}`)) {
        setRedirectUrl(data.redirectUrl);
        window.location.replace(`${data.redirectUrl}`);
      } else {
        setRedirectUrl("404");
      }
    } catch (error) {
      setRedirectUrl("404");
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    getShortenerInfo();
  }, []);

  const replaceMe = () => {
    replace("/404");
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={redirectUrl || "/"} />
      </Head>
      {!isLoaded ? <Loader /> : redirectUrl === "404" && replaceMe()}
    </>
  );
};

export default Shortener;
