import { PartnerProjectPage } from "@/modules/partnerProject/pages/partnerProject";
import { GetServerSideProps } from "next";

const PartnerProject = () => <PartnerProjectPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "AlphaPartner",
      link: "/partner",
    },
  };
};

export default PartnerProject;
