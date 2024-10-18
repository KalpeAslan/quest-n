import { CreateQuestPage } from "@modules/quest/pages/createQuest";
import { GetServerSideProps } from "next";

const EditQuest = () => <CreateQuestPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Create quest",
      link: "/admin/quest/create",
    },
  };
};

export default EditQuest;
