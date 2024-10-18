import { GetServerSideProps } from "next";
import InviteToPartnerProjectAuthPage from "@modules/account/pages/inviteToPartnerProjectAuthPage/inviteToPartnerProjectAuthPage";

const InviteToPartnerProjectSignUp = () => (
  <InviteToPartnerProjectAuthPage flow={"sign-up"} />
);

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Sign-up",
      link: "/inviteToPartnerProjectSignUp",
    },
  };
};

export default InviteToPartnerProjectSignUp;
