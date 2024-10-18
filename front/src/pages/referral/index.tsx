import { ReferralPage } from "@/modules/account/pages/referral";
import { GetServerSideProps } from "next";

const Referral = () => <ReferralPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Referral",
      link: "/referral",
    },
  };
};

export default Referral;
