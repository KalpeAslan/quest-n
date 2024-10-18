import { QuestPreviewPage } from "@modules/quest/pages/questPreview";
import { GetServerSideProps } from "next";

const QuestPreview = () => <QuestPreviewPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Quest preview",
      link: "/admin/project/quests/edit",
    },
  };
};

export default QuestPreview;
