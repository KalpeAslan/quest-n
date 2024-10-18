import { PageLoader } from "@/components/pageLoader";
import { LocalStorageService } from "@/services";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const MIN = 1;
const MAX = 2;

const Page1 = dynamic(
  () => import("@modules/landing/pages/Page1").then(res => res.Page1),
  { ssr: false, loading: () => <PageLoader /> },
);
const Page2 = dynamic(
  () => import("@modules/landing/pages/Page2").then(res => res.Page2),
  { ssr: false, loading: () => <PageLoader /> },
);

const LandingPage = () => {
  const [pageNumber, setPageNumber] = useState(0);

  const init = useCallback(async () => {
    if (await LocalStorageService.getItemAsync("lpg")) {
      setPageNumber(Number(await LocalStorageService.getItemAsync("lpg")));
    } else {
      const random = Math.floor(Math.random() * (MAX - MIN + 1) + MIN);
      setPageNumber(random);
      LocalStorageService.setItem("lpg", random);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      {pageNumber === 1 && <Page1 />}
      {pageNumber === 2 && <Page2 />}
    </>
  );
};

export default LandingPage;
