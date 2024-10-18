import { ResetPasswordPage } from "@/modules/account/pages/resetPassword";
import { GetServerSideProps } from "next";

const ResetPassword = () => <ResetPasswordPage />;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: "Reset password",
      link: "/reset-password",
    },
  };
};

export default ResetPassword;
