import { AnalyticsQuest } from "@modules/quest/pages/analyticsQuest/AnalyticsQuest";
import { useRouter } from "next/router";

const AnalyticsQuestPage = () => {
  const { query } = useRouter();
  const questLinkTitle = query.quest as string;
  return <AnalyticsQuest questLinkTitle={questLinkTitle} partnerProjectLinkTitle={query.linkTitle as string}/>;
};

export default AnalyticsQuestPage;
