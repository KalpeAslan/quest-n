import { PartnerProjectQuestsPage } from "@modules/partnerProject/pages/partnerProjectQuests";
import { GetServerSideProps } from "next";

const PartnerProjectQuests = () => <PartnerProjectQuestsPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "AlphaPartner Quests",
      link: "/admin/project",
    },
  };
};

export default PartnerProjectQuests;
