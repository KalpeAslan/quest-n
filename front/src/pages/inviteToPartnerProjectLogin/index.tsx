import { GetServerSideProps } from "next";
import InviteToPartnerProjectAuthPage from "@modules/account/pages/inviteToPartnerProjectAuthPage/inviteToPartnerProjectAuthPage";

const InviteToPartnerProjectSignUp = () => (
  <InviteToPartnerProjectAuthPage flow={"login"} />
);

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Login",
      link: "/inviteToPartnerProjectLogin",
    },
  };
};

export default InviteToPartnerProjectSignUp;
