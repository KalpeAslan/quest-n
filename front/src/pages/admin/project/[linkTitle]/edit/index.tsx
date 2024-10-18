import { CreatePartnerProjectPage } from "@modules/partnerProject/pages/createPartnerProject";
import { GetServerSideProps } from "next";

const PartnerProjectSettings = () => <CreatePartnerProjectPage isEdit />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "AlphaPartner Settings",
      link: "/admin/project/edit",
    },
  };
};

export default PartnerProjectSettings;
