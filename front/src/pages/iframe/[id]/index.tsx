import { IframeQuestPage } from "@/modules/quest/pages/iframeQuest";
import { GetServerSideProps } from "next";

const IframeQuest = () => <IframeQuestPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "AlphaQuest",
      link: "/iframe",
    },
  };
};

export default IframeQuest;
