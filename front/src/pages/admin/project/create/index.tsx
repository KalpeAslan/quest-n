import { CreatePartnerProjectPage } from "@/modules/partnerProject/pages/createPartnerProject";
import { GetServerSideProps } from "next";

const CreatePartnerProject = () => <CreatePartnerProjectPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Create project",
      link: "/admin/project/create",
    },
  };
};

export default CreatePartnerProject;
