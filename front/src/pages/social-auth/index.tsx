import { useEffect } from "react";
import Head from "next/head";

const SocialAuth = () => {
  useEffect(() => {
    window.opener.parent.postMessage(
      { target: "auth_result", location: window.location.href },
      "*",
    );

    setTimeout(() => {
      window.close();
    }, 150);
  }, []);

  return (
    <>
      <Head>
        <link rel="canonical" href="/social-auth" />
      </Head>
      <div className="background-other"></div>
    </>
  );
};

export default SocialAuth;
