import { QuestProjectPage } from "@/modules/quest/pages";
import { GetServerSideProps } from "next";

const QuestProject = () => <QuestProjectPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "AlphaQuest",
      link: "/quest",
    },
  };
};

export default QuestProject;
