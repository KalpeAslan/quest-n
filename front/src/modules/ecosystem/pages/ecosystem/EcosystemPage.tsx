import { IPartner } from "@models";
import { useContextSelector } from "use-context-selector";
import { AppContext, WagmiContext } from "@context";
import { useEffect, useState } from "react";
import { Loader } from "@components/UI/loader";
import { TopSection } from "@/modules/ecosystem/components/topSection";
import { Ecosystem } from "@/modules/ecosystem/components/ecosystem";
import { homeService } from "@api";
import { LoggerService } from "@services";
import dynamic from "next/dynamic";
import SkeletonLoader from "@components/UI/skeletonLoader/SkeletonLoader";
import { PartnersProps } from "@/modules/ecosystem/components/partners/Partners";
import { Box } from "@mui/material";

const LauncherLazy = dynamic(
  () =>
    import("@/modules/ecosystem/components/launcherSection").then(
      res => res.Launcher,
    ),
  {
    ssr: false,
    loading: () => <SkeletonLoader width={"100%"} height={"100%"} />,
  },
);

const AlphaQuestLazy = dynamic(
  () =>
    import("@/modules/ecosystem/components/alphaQuestSection").then(
      res => res.AlphaQuest,
    ),
  {
    ssr: false,
    loading: () => <SkeletonLoader width={"100%"} height={"100%"} />,
  },
);

const LaunchBlockchainLazy = dynamic(
  () =>
    import("@/modules/ecosystem/components/launchBlockchainSection").then(
      res => res.LaunchBlockchain,
    ),
  {
    ssr: false,
    loading: () => <SkeletonLoader width={"100%"} height={"100%"} />,
  },
);

const ApplySectionLazy = dynamic(
  () =>
    import("@/modules/ecosystem/components/applySection").then(
      res => res.ApplySection,
    ),
  {
    ssr: false,
    loading: () => <SkeletonLoader width={"100%"} height={"100%"} />,
  },
);

const PartnersLazy = dynamic<PartnersProps>(
  () =>
    import("@/modules/ecosystem/components/partners").then(res => res.Partners),
  {
    ssr: false,
    loading: () => <SkeletonLoader width={"100%"} height={"100%"} />,
  },
);

const EcosystemPage = () => {
  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );

  const networks = useContextSelector(WagmiContext, state => state.networks);

  const [partners, setPartners] = useState<IPartner[]>([]);

  const getProjects = async () => {
    if (!networks) {
      return;
    }

    try {
      const { data: partnersData } = await homeService.getHomePartnersData();

      setPartners(partnersData);
    } catch (err: any) {
      LoggerService.error("Error during getting projects on home page", err);
    }
  };

  useEffect(() => {
    getProjects();
    return () => {
      if (prevLocation) {
        prevLocation.current = location.pathname;
      }
    };
  }, []);

  return (
    <div className="background-other">
      {!networks ? (
        <Loader />
      ) : (
        <>
          <TopSection />

          <Ecosystem />

          <LauncherLazy />

          <AlphaQuestLazy />

          <LaunchBlockchainLazy />

          <Box overflow="hidden">
            {partners && partners.length > 0 && (
              <PartnersLazy partners={partners} />
            )}

            <ApplySectionLazy />
          </Box>
        </>
      )}
    </div>
  );
};

export default EcosystemPage;
