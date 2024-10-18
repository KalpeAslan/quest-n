import { ParticipatedQuestsPage } from "@modules/quest/pages/participatedQuests";
import { GetServerSideProps } from "next";

const ParticipatedQuests = () => {
  return <ParticipatedQuestsPage />;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Participated Quests",
      link: "/admin/quest",
    },
  };
};

export default ParticipatedQuests;
